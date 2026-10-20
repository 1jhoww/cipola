export type Quote = {
  name: string;
  email: string;
  phone: string;
  project: string;
  material: string;
  location: string;
  message: string;
  consent: boolean;
  company?: string;
};
export const projectTypes = [
  "Residencial",
  "Comercial",
  "Parceria profissional",
  "Outro",
];
export function validateQuote(input: unknown): {
  data?: Quote;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  if (!input || typeof input !== "object")
    return { errors: { form: "Dados inválidos." } };
  const record = input as Record<string, unknown>;
  const string = (key: string) =>
    typeof record[key] === "string" ? record[key].trim() : "";
  const data: Quote = {
    name: string("name"),
    email: string("email"),
    phone: string("phone"),
    project: string("project"),
    material: string("material"),
    location: string("location"),
    message: string("message"),
    consent: record.consent === true,
    company: string("company"),
  };
  if (data.name.length < 2 || data.name.length > 120)
    errors.name = "Informe seu nome (2 a 120 caracteres).";
  // Phone is required (the conversation happens on WhatsApp); e-mail is optional.
  if (data.phone.replace(/\D/g, "").length < 10 || data.phone.length > 30)
    errors.phone = "Informe um telefone com DDD.";
  if (
    data.email &&
    (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 254)
  )
    errors.email = "Informe um e-mail válido.";
  if (!projectTypes.includes(data.project))
    errors.project = "Selecione o tipo de projeto.";
  if (data.location.length < 2 || data.location.length > 160)
    errors.location = "Informe a cidade e o estado da obra.";
  if (data.material.length > 120) errors.material = "Material inválido.";
  // The message travels in a WhatsApp link, so it stays short enough for the URL.
  if (data.message.length > 1500) errors.message = "Use até 1.500 caracteres.";
  if (!data.consent)
    errors.consent = "Autorize o envio dos dados para responder à solicitação.";
  return { data, errors };
}

// Text of the WhatsApp message that carries a quote request to Cipola.
export function quoteMessage(data: Quote, materialName: string) {
  const details = [
    `*Nome:* ${data.name}`,
    `*Telefone:* ${data.phone}`,
    data.email && `*E-mail:* ${data.email}`,
    `*Tipo de projeto:* ${data.project}`,
    `*Material:* ${materialName || "Ainda estou escolhendo"}`,
    `*Cidade da obra:* ${data.location}`,
  ].filter(Boolean);
  return [
    "Olá! Vim pelo site da Cipola e gostaria de um orçamento.",
    details.join("\n"),
    data.message && `*Sobre o projeto:*\n${data.message}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}
