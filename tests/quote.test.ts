import test from "node:test";
import assert from "node:assert/strict";
// Node strip-types resolves explicit extensions for isolated validation tests.
// @ts-expect-error TypeScript's app resolver omits .ts extensions; Node requires one here.
import { quoteMessage, validateQuote } from "../src/lib/quote.ts";
const valid = {
  name: "Ana Silva",
  email: "ana@example.com",
  phone: "11987654321",
  project: "Residencial",
  material: "branco-itaunas",
  location: "São Paulo, SP",
  message: "Uma bancada.",
  consent: true,
};
test("accepts a complete quote and trims user input", () => {
  const result = validateQuote({ ...valid, name: " Ana Silva " });
  assert.deepEqual(result.errors, {});
  assert.equal(result.data?.name, "Ana Silva");
});
test("requires consent, valid email, project and location", () => {
  const result = validateQuote({
    ...valid,
    email: "email",
    project: "inventado",
    location: "",
    consent: false,
  });
  assert.deepEqual(Object.keys(result.errors).sort(), [
    "consent",
    "email",
    "location",
    "project",
  ]);
});
test("rejects non-object requests", () => {
  assert.ok(validateQuote(null).errors.form);
  assert.ok(validateQuote("text").errors.form);
});
test("requires a telephone and accepts a quote without e-mail", () => {
  assert.ok(validateQuote({ ...valid, phone: "" }).errors.phone);
  assert.deepEqual(validateQuote({ ...valid, email: "" }).errors, {});
});
test("caps untrusted free text and checks the telephone", () => {
  const result = validateQuote({
    ...valid,
    message: "x".repeat(3001),
    phone: "123",
  });
  assert.ok(result.errors.message);
  assert.ok(result.errors.phone);
});
test("does not accept string consent", () => {
  assert.ok(validateQuote({ ...valid, consent: "true" }).errors.consent);
});
test("builds the WhatsApp message with every filled field", () => {
  const data = validateQuote(valid).data!;
  assert.equal(
    quoteMessage(data, "Branco Itaúnas"),
    [
      "Olá! Vim pelo site da Cipola e gostaria de um orçamento.",
      "",
      "*Nome:* Ana Silva",
      "*Telefone:* 11987654321",
      "*E-mail:* ana@example.com",
      "*Tipo de projeto:* Residencial",
      "*Material:* Branco Itaúnas",
      "*Cidade da obra:* São Paulo, SP",
      "",
      "*Sobre o projeto:*",
      "Uma bancada.",
    ].join("\n"),
  );
});
test("leaves out an empty e-mail and message from the WhatsApp text", () => {
  const data = validateQuote({ ...valid, email: "", message: "" }).data!;
  const text = quoteMessage(data, "");
  assert.ok(!text.includes("E-mail"));
  assert.ok(!text.includes("Sobre o projeto"));
  assert.ok(text.endsWith("*Cidade da obra:* São Paulo, SP"));
  assert.ok(text.includes("*Material:* Ainda estou escolhendo"));
});
