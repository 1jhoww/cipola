import test from "node:test";
import assert from "node:assert/strict";
import {
  apiCall,
  classifyError,
  credentials,
  imageContentType,
  submit,
  trustedResultUrl,
} from "../scripts/higgsfield/client.mjs";
import {
  environments,
  masterPrompt,
  materialPrompt,
} from "../scripts/higgsfield/presets.mjs";

const env = { HF_CREDENTIALS: "test-id:test-secret" };

test("credentials are required and must use the id:secret format", () => {
  assert.throws(() => credentials({}), { code: "not_configured" });
  assert.throws(() => credentials({ HF_CREDENTIALS: "only-one-part" }), {
    code: "not_configured",
  });
  assert.equal(credentials(env), "test-id:test-secret");
});

test("documented HTTP errors map to stable codes and retry policy", () => {
  assert.deepEqual(
    classifyError(400, "Maximum number of concurrent requests (4) has been reached"),
    { code: "concurrency_limit", retryable: true },
  );
  assert.deepEqual(classifyError(401, "Invalid credentials"), {
    code: "auth_failed",
    retryable: false,
  });
  assert.equal(classifyError(403, "x").code, "insufficient_credits");
  assert.equal(
    classifyError(422, "Idempotency-Key was already used with different request parameters").code,
    "idempotency_conflict",
  );
  assert.equal(classifyError(500, "x").retryable, true);
});

test("credential stays in the Authorization header and errors never echo it", async () => {
  const mock: typeof fetch = async (input, init) => {
    assert.equal(String(input), "https://api.higgsfield.ai/estimate/marketing-studio/image/flare");
    assert.equal(new Headers(init?.headers).get("authorization"), "Key test-id:test-secret");
    assert.equal(init?.redirect, "error");
    return Response.json({ detail: "Not enough credits" }, { status: 403 });
  };
  await assert.rejects(
    () => apiCall("/estimate/marketing-studio/image/flare", { body: { prompt: "x" }, fetchImpl: mock, env }),
    (error: Error & { code: string }) =>
      error.code === "insufficient_credits" && !error.message.includes("test-secret"),
  );
});

test("submission replays the same Idempotency-Key after a server error", async () => {
  const keys: string[] = [];
  let calls = 0;
  const mock: typeof fetch = async (_input, init) => {
    calls++;
    keys.push(new Headers(init?.headers).get("idempotency-key") ?? "");
    if (calls === 1) return Response.json({ detail: "boom" }, { status: 500 });
    return Response.json({
      status: "queued",
      request_id: "d7e6c0f3-6699-4f6c-bb45-2ad7fd9158ff",
    });
  };
  const result = await submit("marketing-studio/image/flare", { prompt: "x" }, "key-1", {
    fetchImpl: mock,
    env,
    log: () => {},
  });
  assert.equal(result.request_id, "d7e6c0f3-6699-4f6c-bb45-2ad7fd9158ff");
  assert.deepEqual(keys, ["key-1", "key-1"]);
});

test("non-retryable submission errors are not retried", async () => {
  let calls = 0;
  const mock: typeof fetch = async () => {
    calls++;
    return Response.json({ detail: "Invalid credentials" }, { status: 401 });
  };
  await assert.rejects(
    () => submit("marketing-studio/image/flare", { prompt: "x" }, "key-2", { fetchImpl: mock, env, log: () => {} }),
    { code: "auth_failed" },
  );
  assert.equal(calls, 1);
});

test("downloads must be raster images from Higgsfield hosts", () => {
  assert.equal(imageContentType(new Uint8Array([255, 216, 255, 0])), "image/jpeg");
  assert.throws(() => imageContentType(Buffer.from('<svg onload="alert(1)">')));
  assert.equal(trustedResultUrl("https://d3snorpfx4xhv8.cloudfront.net/a.png"), true);
  assert.equal(trustedResultUrl("http://d3snorpfx4xhv8.cloudfront.net/a.png"), false);
  assert.equal(trustedResultUrl("https://evil.example/a.png"), false);
});

test("every environment keeps a fixed composition and edits only stone surfaces", () => {
  const reference = {
    name: "Preto São Gabriel",
    category: "granite",
    finish: "polished",
    description: "near-black granite.",
  };
  for (const id of Object.keys(environments)) {
    assert.match(masterPrompt(id), /placeholder/);
    assert.match(masterPrompt(id), /No people, no text, no logos/);
    const prompt = materialPrompt(id, reference);
    assert.match(prompt, /Keep EVERYTHING else unchanged/);
    assert.ok(prompt.includes(environments[id as keyof typeof environments].surfaces));
  }
});
