// Higgsfield API client for local, development-only generation scripts.
// Docs: https://docs.higgsfield.ai (requests, errors, idempotency, file uploads, billing).
// The credential is read from HF_CREDENTIALS ("<key id>:<key secret>") and only ever
// placed in the Authorization header. It is never logged or written to disk.
import { randomUUID } from "node:crypto";

export const API_BASE = "https://api.higgsfield.ai";
const TERMINAL = new Set(["completed", "failed", "nsfw", "canceled"]);
const RESULT_HOSTS = [".cloudfront.net", ".higgsfield.ai"];
const MAX_IMAGE_BYTES = 40 * 1024 * 1024;

export class HiggsfieldError extends Error {
  /**
   * @param {string} code
   * @param {string} message
   * @param {{ status?: number, retryable?: boolean, correlationId?: string | null }} [extra]
   */
  constructor(code, message, extra = {}) {
    super(message);
    this.code = code;
    this.status = extra.status;
    this.retryable = extra.retryable ?? false;
    this.correlationId = extra.correlationId ?? null;
  }
}

/** Maps documented HTTP statuses (docs/concepts/errors) to stable codes. */
export function classifyError(status, detail) {
  const text = typeof detail === "string" ? detail : JSON.stringify(detail ?? "");
  if (status === 400 && /concurrent/i.test(text))
    return { code: "concurrency_limit", retryable: true };
  if (status === 400) return { code: "invalid_request", retryable: false };
  if (status === 401) return { code: "auth_failed", retryable: false };
  if (status === 403) return { code: "insufficient_credits", retryable: false };
  if (status === 404) return { code: "not_found", retryable: false };
  if (status === 422 && /idempotency/i.test(text))
    return { code: "idempotency_conflict", retryable: false };
  if (status === 422) return { code: "validation_failed", retryable: false };
  if (status === 423) return { code: "model_temporarily_blocked", retryable: true };
  if (status === 429) return { code: "rate_limited", retryable: true };
  if (status === 503) return { code: "model_unavailable", retryable: true };
  if (status >= 500) return { code: "server_error", retryable: true };
  return { code: "unexpected_status", retryable: false };
}

/** @param {Record<string, string | undefined>} [env] */
export function credentials(env = process.env) {
  const value = env.HF_CREDENTIALS?.trim();
  if (!value || !/^[^:\s]+:[^:\s]+$/.test(value))
    throw new HiggsfieldError(
      "not_configured",
      "HF_CREDENTIALS ausente ou inválida em .env.local (formato <id>:<secret>).",
    );
  return value;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const backoff = (attempt) =>
  Math.min(60000, 2000 * 2 ** attempt) * (0.75 + Math.random() * 0.5);

/**
 * Single HTTP call with timeout. Throws HiggsfieldError on non-2xx.
 * @param {string} path
 * @param {{ method?: string, body?: unknown, headers?: Record<string,string>, timeoutMs?: number, fetchImpl?: typeof fetch, env?: Record<string, string | undefined> }} [options]
 */
export async function apiCall(path, options = {}) {
  const {
    method = options.body === undefined ? "GET" : "POST",
    body,
    headers = {},
    timeoutMs = 60000,
    fetchImpl = fetch,
    env = process.env,
  } = options;
  if (!path.startsWith("/")) throw new Error("path must be relative to API_BASE");
  let response;
  try {
    response = await fetchImpl(`${API_BASE}${path}`, {
      method,
      headers: {
        Authorization: `Key ${credentials(env)}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "error",
    });
  } catch (error) {
    if (error instanceof HiggsfieldError) throw error;
    throw new HiggsfieldError(
      "network_error",
      `Falha de rede ou timeout em ${method} ${path}.`,
      { retryable: true },
    );
  }
  const correlationId = response.headers.get("x-correlation-id");
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: text.slice(0, 200) };
  }
  if (!response.ok) {
    const { code, retryable } = classifyError(response.status, data.detail);
    const detail =
      typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
    throw new HiggsfieldError(code, `${response.status} ${detail ?? ""}`.trim(), {
      status: response.status,
      retryable,
      correlationId,
    });
  }
  return data;
}

/** Retries only errors documented as retryable, with exponential backoff and jitter. */
export async function withRetry(task, { attempts = 5, label = "request", log = console.log } = {}) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await task();
    } catch (error) {
      if (!(error instanceof HiggsfieldError) || !error.retryable || attempt >= attempts - 1)
        throw error;
      const wait = backoff(attempt);
      log(`  ${label}: ${error.code}, nova tentativa em ${Math.round(wait / 1000)}s`);
      await sleep(wait);
    }
  }
}

/** Free price estimate (docs/concepts/billing-and-retention). */
export function estimate(endpoint, body, options) {
  return apiCall(`/estimate/${endpoint}`, { ...options, body });
}

/**
 * Paid submission. The idempotency key must be persisted by the caller BEFORE calling,
 * so an ambiguous timeout can be replayed without a second charge.
 */
export async function submit(endpoint, body, idempotencyKey, options = {}) {
  if (!idempotencyKey) throw new Error("idempotencyKey is required");
  const result = await withRetry(
    () =>
      apiCall(`/${endpoint}`, {
        ...options,
        body,
        headers: { "Idempotency-Key": idempotencyKey },
      }),
    { label: "submissão", log: options.log },
  );
  if (typeof result.request_id !== "string" || !/^[0-9a-f-]{36}$/i.test(result.request_id))
    throw new HiggsfieldError("unexpected_response", "Resposta sem request_id válido.");
  return result;
}

export function requestStatus(requestId, options) {
  if (!/^[0-9a-f-]{36}$/i.test(requestId)) throw new Error("invalid request id");
  return withRetry(() => apiCall(`/requests/${requestId}/status`, options), {
    label: "status",
    log: options?.log,
  });
}

/** Polls until a terminal status or the deadline. Returns the last status payload. */
export async function waitForResult(requestId, { deadlineMs = 15 * 60000, log = console.log, ...options } = {}) {
  const started = Date.now();
  let interval = 4000;
  for (;;) {
    const status = await requestStatus(requestId, { ...options, log });
    if (TERMINAL.has(status.status)) return status;
    if (Date.now() - started > deadlineMs) return status;
    log(`  ${requestId}: ${status.status}…`);
    await sleep(interval);
    interval = Math.min(15000, Math.round(interval * 1.4));
  }
}

/**
 * Uploads a local reference so the API reads a stable copy instead of a third-party URL.
 * Credentials are never sent to the presigned storage URL.
 */
export async function uploadFile(bytes, contentType, options = {}) {
  const ticket = await withRetry(
    () =>
      apiCall("/files/generate-upload-url", {
        ...options,
        body: { content_type: contentType },
      }),
    { label: "upload-url", log: options.log },
  );
  if (!ticket.upload_url || !ticket.public_url)
    throw new HiggsfieldError("unexpected_response", "Upload URL ausente.");
  const fetchImpl = options.fetchImpl ?? fetch;
  const put = await fetchImpl(ticket.upload_url, {
    method: "PUT",
    headers: { ...(ticket.upload_headers ?? {}), "Content-Type": contentType },
    body: bytes,
    signal: AbortSignal.timeout(120000),
  });
  if (!put.ok)
    throw new HiggsfieldError("upload_failed", `Upload falhou (${put.status}).`, {
      status: put.status,
    });
  return ticket.public_url;
}

export function imageContentType(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (Buffer.from(bytes.subarray(0, 8)).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    return "image/png";
  if (
    Buffer.from(bytes.subarray(0, 4)).toString() === "RIFF" &&
    Buffer.from(bytes.subarray(8, 12)).toString() === "WEBP"
  )
    return "image/webp";
  throw new HiggsfieldError("invalid_image", "Arquivo recebido não é JPEG, PNG ou WebP.");
}

export function trustedResultUrl(value) {
  const url = new URL(value);
  return (
    url.protocol === "https:" &&
    (url.hostname === "higgsfield.ai" || RESULT_HOSTS.some((h) => url.hostname.endsWith(h)))
  );
}

export async function downloadImage(value, fetchImpl = fetch) {
  if (!trustedResultUrl(value))
    throw new HiggsfieldError("untrusted_result_host", `Host de resultado inesperado: ${new URL(value).hostname}`);
  const response = await fetchImpl(value, { signal: AbortSignal.timeout(120000) });
  if (!response.ok) throw new HiggsfieldError("download_failed", `Download falhou (${response.status}).`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > MAX_IMAGE_BYTES) throw new HiggsfieldError("image_too_large", "Imagem acima de 40 MB.");
  return { bytes, contentType: imageContentType(bytes) };
}

export const newIdempotencyKey = () => randomUUID();
