import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const sources = JSON.parse(
  (await readFile("public/textures/sources.json", "utf8")).replace(
    /^\uFEFF/,
    "",
  ),
);
const routes = [
  "/",
  "/a-cipola",
  "/materiais",
  "/projetos",
  "/arquitetos",
  "/contato",
  "/visualizador",
  "/privacidade",
  "/projetos/cozinha-integrada",
  "/projetos/banho-natural",
  ...sources.map((s) => `/materiais/${s.slug}`),
];
for (const route of routes) {
  const r = await fetch(base + route);
  assert.equal(r.status, 200, route);
  const html = await r.text();
  assert.ok(html.includes("<h1"), `${route}: h1`);
  assert.ok(html.includes("<title>"), `${route}: title`);
}
for (const source of sources) {
  const r = await fetch(`${base}/textures/${source.slug}.jpg`);
  assert.equal(r.status, 200, source.slug);
  assert.ok((await r.arrayBuffer()).byteLength > 1000);
}
for (const route of ["/experimental/ambientes", "/experimental/presets"])
  assert.equal((await fetch(base + route)).status, 404);
assert.equal((await fetch(base + "/api/admin/material-images")).status, 401);
assert.equal(
  (
    await fetch(base + "/api/admin/material-images", {
      method: "POST",
      body: "{}",
    })
  ).status,
  401,
);
assert.equal(
  (await fetch(base + "/api/material-images/invalid/cozinha")).status,
  404,
);
assert.equal((await fetch(base + "/materiais/inexistente")).status, 404);
const post = (data, headers = {}) =>
  fetch(base + "/api/orcamento", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(data),
  });
assert.equal((await post({})).status, 422);
assert.equal(
  (await post({}, { Origin: "https://untrusted.example" })).status,
  403,
);
const valid = {
  name: "Teste local",
  email: "teste@example.com",
  phone: "",
  project: "Residencial",
  material: "branco-itaunas",
  location: "São Paulo, SP",
  message: "Teste sem integração configurada.",
  consent: true,
};
assert.equal(
  (await post(valid)).status,
  503,
  "No delivery must be reported as success without a configured endpoint.",
);
assert.equal(
  (await post({ ...valid, message: "a".repeat(17000) })).status,
  413,
);
assert.equal((await fetch(base + "/robots.txt")).status, 200);
assert.equal((await fetch(base + "/sitemap.xml")).status, 200);
console.log(
  `PASS: ${routes.length} pages, ${sources.length} textures, removed room routes, protected image generation, 404, metadata, robots/sitemap and API validation.`,
);
