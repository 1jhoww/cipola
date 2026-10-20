// Development-only generator for the "material in environment" simulations.
// Visitors never trigger generation: approved results become static files in
// public/images/materiais/<slug>/<environment>.webp, listed in src/content/material-images.json.
//
//   node scripts/generate-material-images.mjs check
//   node scripts/generate-material-images.mjs status
//   node scripts/generate-material-images.mjs master <environment> --yes      (paid)
//   node scripts/generate-material-images.mjs generate <slug> <environment> --yes   (paid)
//   node scripts/generate-material-images.mjs poll <slug|master> <environment>
//   node scripts/generate-material-images.mjs approve <slug|master> <environment>
//   node scripts/generate-material-images.mjs reject <slug|master> <environment>
//   node scripts/generate-material-images.mjs prompt <slug|master> <environment>
//   node scripts/generate-material-images.mjs import <slug|master> <environment> <file> --source "<tool/model>"
//
// "prompt" + "import" support images produced manually in another tool (e.g. Gemini) with the
// same presets: the file goes through the same review/approve flow and registry.
//
// Paid commands submit exactly ONE generation per run and require --yes.
import { copyFile, mkdir, open, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  HiggsfieldError,
  credentials,
  imageContentType,
  downloadImage,
  estimate,
  newIdempotencyKey,
  submit,
  uploadFile,
  waitForResult,
} from "./higgsfield/client.mjs";
import { MODEL, OUTPUT, environments, masterPrompt, materialPrompt } from "./higgsfield/presets.mjs";

try {
  process.loadEnvFile(".env.local");
} catch {
  /* Variables may already be set in the environment. */
}

const ROOT = process.cwd();
const STATE = path.join(ROOT, "data", "image-generation");
const REGISTRY = path.join(ROOT, "src", "content", "material-images.json");
const PUBLIC_DIR = path.join(ROOT, "public", "images", "materiais");
const MASTER = "master";
const MIN_REFERENCE_PX = 400;

const [command = "help", ...rest] = process.argv.slice(2);
const flags = new Set(rest.filter((a) => a.startsWith("--")));
const args = rest.filter((a, i) => !a.startsWith("--") && !rest[i - 1]?.startsWith("--source"));

const log = (...parts) => console.log(...parts);
const now = () => new Date().toISOString();
const jobFile = (slug, env) => path.join(STATE, "jobs", `${slug}--${env}.json`);

async function readJson(file, fallback = null) {
  try {
    return JSON.parse((await readFile(file, "utf8")).replace(/^﻿/, ""));
  } catch (error) {
    if (error.code === "ENOENT") return fallback;
    throw error;
  }
}
async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`);
  await rename(temporary, file);
}
async function saveJob(job) {
  job.updatedAt = now();
  await writeJson(jobFile(job.slug, job.environment), job);
}

function requireEnvironment(env) {
  if (!Object.hasOwn(environments, env))
    throw new Error(`Ambiente inválido. Use: ${Object.keys(environments).join(", ")}`);
}
async function references() {
  return (await readJson(path.join(ROOT, "scripts", "higgsfield", "references.json"))).materials;
}
async function requireReference(slug) {
  const reference = (await references())[slug];
  if (!reference) throw new Error(`Material sem referência cadastrada: ${slug}`);
  if (!reference.description)
    throw new Error(`${slug}: sem descrição aprovada da pedra em references.json.`);
  if (!reference.approved)
    throw new Error(`${slug}: referência não aprovada (approved=false em references.json).`);
  // The resolution that matters is the file actually sent to generation.
  const meta = await sharp(path.join(ROOT, reference.generationFile ?? reference.file)).metadata();
  if (Math.min(meta.width, meta.height) < MIN_REFERENCE_PX)
    throw new Error(`${slug}: referência abaixo de ${MIN_REFERENCE_PX}px.`);
  return reference;
}

async function withLock(slug, env, task) {
  const lockPath = `${jobFile(slug, env)}.lock`;
  await mkdir(path.dirname(lockPath), { recursive: true });
  let handle;
  try {
    handle = await open(lockPath, "wx");
  } catch (error) {
    if (error.code === "EEXIST")
      throw new Error(`Outro processo está trabalhando em ${slug}/${env} (${lockPath}).`);
    throw error;
  }
  try {
    return await task();
  } finally {
    await handle.close();
    await unlink(lockPath);
  }
}

async function upload(file) {
  const bytes = await readFile(file);
  const type = file.endsWith(".png") ? "image/png" : file.endsWith(".webp") ? "image/webp" : "image/jpeg";
  return uploadFile(bytes, type, { log });
}

async function buildRequest(slug, env) {
  if (slug === MASTER) return { prompt: masterPrompt(env), ...OUTPUT };
  const master = await readJson(jobFile(MASTER, env));
  if (master?.status !== "approved" || !master.original)
    throw new Error(`Aprove primeiro o master de ${env} (master ${env} → approve master ${env}).`);
  const reference = await requireReference(slug);
  log("  Enviando master e referência para o armazenamento da Higgsfield…");
  const image_urls = [
    await upload(path.join(ROOT, master.original)),
    await upload(path.join(ROOT, reference.generationFile ?? reference.file)),
  ];
  return { prompt: materialPrompt(env, reference), image_urls, ...OUTPUT, enhance_prompt: false };
}

async function finish(job) {
  log(`  Aguardando ${job.requestId}…`);
  const result = await waitForResult(job.requestId, { log });
  job.status = result.status;
  if (result.status !== "completed") {
    job.error = result.error ?? null;
    await saveJob(job);
    if (["queued", "in_progress"].includes(result.status))
      log(`  Ainda em processamento. Rode: poll ${job.slug} ${job.environment}`);
    else log(`  Finalizado como ${result.status}${result.error ? `: ${result.error}` : ""} (não cobrado).`);
    return job;
  }
  const url = result.images?.[0]?.url;
  if (!url) throw new HiggsfieldError("missing_output", "Status completed sem imagem.");
  job.resultUrl = url;
  const { bytes, contentType } = await downloadImage(url);
  const ext = contentType.split("/")[1].replace("jpeg", "jpg");
  const base = `${job.slug}--${job.environment}--${job.requestId}`;
  job.original = path.relative(ROOT, path.join(STATE, "originals", `${base}.${ext}`)).replaceAll("\\", "/");
  await mkdir(path.join(STATE, "originals"), { recursive: true });
  await writeFile(path.join(ROOT, job.original), bytes);
  const review = path.join(STATE, "review", `${job.slug}--${job.environment}.webp`);
  await mkdir(path.dirname(review), { recursive: true });
  const info = await sharp(bytes)
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 84, effort: 6, smartSubsample: true })
    .toFile(review);
  job.review = path.relative(ROOT, review).replaceAll("\\", "/");
  job.width = info.width;
  job.height = info.height;
  job.status = "review";
  delete job.error;
  await saveJob(job);
  log(`  Pronto para avaliação: ${job.review} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`);
  log(`  Original: ${job.original}`);
  return job;
}

async function generate(slug, env) {
  requireEnvironment(env);
  if (slug !== MASTER) await requireReference(slug);
  return withLock(slug, env, async () => {
    let job = await readJson(jobFile(slug, env));
    const resumable = job && !job.requestId && job.status === "submitting";
    if (job && !resumable && !["failed", "nsfw", "canceled", "rejected"].includes(job.status))
      throw new Error(`${slug}/${env} já existe com status "${job.status}". Use poll, approve ou reject.`);
    if (!resumable) {
      const body = await buildRequest(slug, env);
      const quote = await estimate(MODEL, body).catch((error) => ({ error: error.code }));
      log("  Estimativa Higgsfield:", quote.credits ? `${quote.credits} créditos (US$ ${quote.usd})` : quote.pricing_description ?? quote.error);
      if (!flags.has("--yes")) {
        log("\n  Geração paga NÃO enviada. Repita com --yes para autorizar UMA geração.");
        if (flags.has("--show-prompt")) log(`\n${body.prompt}`);
        return;
      }
      // Persist the idempotency key and exact body BEFORE submitting: an ambiguous
      // timeout is replayed with the same key and never creates a second charge.
      job = {
        slug,
        environment: env,
        model: MODEL,
        status: "submitting",
        idempotencyKey: newIdempotencyKey(),
        body,
        createdAt: now(),
        history: job ? [...(job.history ?? []), { requestId: job.requestId, status: job.status }] : [],
      };
      await saveJob(job);
    } else {
      if (!flags.has("--yes"))
        return log("  Há uma submissão sem confirmação. Repita com --yes para reenviá-la com a mesma Idempotency-Key.");
      log("  Retomando submissão anterior com a mesma Idempotency-Key.");
    }
    try {
      const accepted = await submit(MODEL, job.body, job.idempotencyKey, { log });
      job.requestId = accepted.request_id;
      job.status = accepted.status ?? "queued";
      await saveJob(job);
      log(`  Aceito: ${job.requestId}`);
    } catch (error) {
      if (error instanceof HiggsfieldError && !error.retryable && error.code !== "network_error") {
        job.status = "failed";
        job.error = error.code;
        await saveJob(job);
      }
      throw error;
    }
    return finish(job);
  });
}

async function poll(slug, env) {
  requireEnvironment(env);
  return withLock(slug, env, async () => {
    const job = await readJson(jobFile(slug, env));
    if (!job?.requestId) throw new Error(`Nenhuma geração enviada para ${slug}/${env}.`);
    if (!["queued", "in_progress", "completed"].includes(job.status))
      return log(`  ${slug}/${env}: ${job.status}`);
    return finish(job);
  });
}

async function approve(slug, env) {
  requireEnvironment(env);
  const job = await readJson(jobFile(slug, env));
  if (job?.status !== "review") throw new Error(`${slug}/${env} não está em avaliação (status: ${job?.status ?? "inexistente"}).`);
  if (slug !== MASTER) {
    const target = path.join(PUBLIC_DIR, slug, `${env}.webp`);
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(path.join(ROOT, job.review), target);
    const registry = await readJson(REGISTRY, { images: {} });
    const reference = (await references())[slug];
    const master = await readJson(jobFile(MASTER, env));
    registry.images[slug] = {
      ...registry.images[slug],
      [env]: {
        src: `/images/materiais/${slug}/${env}.webp`,
        width: job.width,
        height: job.height,
        reference: `/${reference.file.replace(/^public\//, "")}`,
        model: job.model,
        requestId: job.requestId ?? null,
        masterRequestId: master?.requestId ?? null,
        master: master?.original ?? null,
        generatedAt: job.updatedAt,
        approvedAt: now(),
      },
    };
    registry.images = Object.fromEntries(Object.entries(registry.images).sort(([a], [b]) => a.localeCompare(b)));
    await writeJson(REGISTRY, registry);
    log(`  Publicado: public/images/materiais/${slug}/${env}.webp`);
  }
  job.status = "approved";
  await saveJob(job);
  log(`  ${slug}/${env} aprovado.`);
}

async function reject(slug, env) {
  requireEnvironment(env);
  const job = await readJson(jobFile(slug, env));
  if (!job) throw new Error(`Nada para rejeitar em ${slug}/${env}.`);
  if (job.status === "approved" && slug !== MASTER) {
    const registry = await readJson(REGISTRY, { images: {} });
    delete registry.images[slug]?.[env];
    if (registry.images[slug] && !Object.keys(registry.images[slug]).length) delete registry.images[slug];
    await writeJson(REGISTRY, registry);
    await unlink(path.join(PUBLIC_DIR, slug, `${env}.webp`)).catch(() => {});
  }
  job.status = "rejected";
  await saveJob(job);
  log(`  ${slug}/${env} rejeitado; uma nova geração pode ser solicitada.`);
}

async function promptFor(slug, env) {
  requireEnvironment(env);
  if (slug === MASTER) return masterPrompt(env);
  return materialPrompt(env, await requireReference(slug));
}

function option(name) {
  const index = rest.indexOf(name);
  return index >= 0 ? rest[index + 1] : undefined;
}

async function processImage(job, bytes) {
  imageContentType(bytes);
  const base = `${job.slug}--${job.environment}--${job.id}`;
  const meta = await sharp(bytes).metadata();
  const ext = meta.format === "jpeg" ? "jpg" : meta.format;
  job.original = path.relative(ROOT, path.join(STATE, "originals", `${base}.${ext}`)).replaceAll("\\", "/");
  await mkdir(path.join(STATE, "originals"), { recursive: true });
  await writeFile(path.join(ROOT, job.original), bytes);
  // Normalise to the 3:2 frame used by every environment (centre crop only when needed).
  let pipeline = sharp(bytes);
  if (Math.abs(meta.width / meta.height - 1.5) > 0.02) {
    const width = Math.min(meta.width, Math.round(meta.height * 1.5));
    const height = Math.round(width / 1.5);
    // extract() instead of resize(): sharp keeps only the last resize() of a pipeline.
    pipeline = pipeline.extract({
      left: Math.round((meta.width - width) / 2),
      top: Math.round((meta.height - height) / 2),
      width,
      height,
    });
    log(`  Recorte central para 3:2 (${meta.width}×${meta.height} → ${width}×${height}).`);
  }
  const review = path.join(STATE, "review", `${job.slug}--${job.environment}.webp`);
  await mkdir(path.dirname(review), { recursive: true });
  const info = await pipeline
    .resize({ width: 2400, withoutEnlargement: true })
    .webp({ quality: 84, effort: 6, smartSubsample: true })
    .toFile(review);
  job.review = path.relative(ROOT, review).replaceAll("\\", "/");
  job.width = info.width;
  job.height = info.height;
  job.status = "review";
  delete job.error;
  await saveJob(job);
  log(`  Pronto para avaliação: ${job.review} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB)`);
}

async function importImage(slug, env, file) {
  requireEnvironment(env);
  const source = option("--source");
  if (!file || !source) throw new Error("Uso: import <slug|master> <amb> <arquivo> --source \"<ferramenta/modelo>\"");
  if (slug !== MASTER) {
    const master = await readJson(jobFile(MASTER, env));
    if (master?.status !== "approved") throw new Error(`Aprove primeiro o master de ${env}.`);
  }
  const prompt = await promptFor(slug, env);
  return withLock(slug, env, async () => {
    const previous = await readJson(jobFile(slug, env));
    if (previous && ["review", "approved"].includes(previous.status))
      throw new Error(`${slug}/${env} já está ${previous.status}. Rejeite antes de importar outra.`);
    const job = {
      id: newIdempotencyKey(),
      slug,
      environment: env,
      model: source,
      status: "importing",
      prompt,
      createdAt: now(),
      history: previous ? [...(previous.history ?? []), { model: previous.model, status: previous.status }] : [],
    };
    await processImage(job, await readFile(path.resolve(file)));
  });
}

async function status() {
  const refs = await references();
  for (const slug of [MASTER, ...Object.keys(refs)]) {
    const row = [];
    for (const env of Object.keys(environments)) {
      const job = await readJson(jobFile(slug, env));
      row.push(`${env}:${job?.status ?? "-"}`);
    }
    log(`${slug.padEnd(18)} ${row.join("  ")}`);
  }
}

async function check() {
  credentials();
  log("Credencial presente (valor não exibido).");
  const quote = await estimate(MODEL, { prompt: "estimate", ...OUTPUT });
  log("Autenticação OK. Preço do modelo:", quote.credits ? `${quote.credits} créditos` : quote.pricing_description);
  const refs = await references();
  for (const [slug, reference] of Object.entries(refs)) {
    const meta = await sharp(path.join(ROOT, reference.generationFile ?? reference.file)).metadata();
    const issues = [
      !reference.approved && "não aprovada",
      !reference.description && "sem descrição",
      Math.min(meta.width, meta.height) < MIN_REFERENCE_PX && "baixa resolução",
    ].filter(Boolean);
    log(`  ${slug.padEnd(18)} ${meta.width}×${meta.height}  ${issues.length ? issues.join(", ") : "pronta"}`);
  }
}

const commands = {
  check: () => check(),
  status: () => status(),
  master: () => generate(MASTER, args[0]),
  generate: () => generate(args[0], args[1]),
  poll: () => poll(args[0], args[1]),
  approve: () => approve(args[0], args[1]),
  reject: () => reject(args[0], args[1]),
  prompt: async () => log(await promptFor(args[0], args[1])),
  import: () => importImage(args[0], args[1], args[2]),
};

if (!commands[command]) {
  log("Comandos: check | status | master <amb> --yes | generate <slug> <amb> --yes | poll|approve|reject <slug|master> <amb>");
  process.exitCode = command === "help" ? 0 : 1;
} else {
  try {
    await commands[command]();
  } catch (error) {
    const extra = error instanceof HiggsfieldError && error.correlationId ? ` [X-Correlation-ID ${error.correlationId}]` : "";
    console.error(`Erro${error.code ? ` (${error.code})` : ""}: ${error.message}${extra}`);
    process.exitCode = 1;
  }
}
