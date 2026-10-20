import { NextRequest, NextResponse } from "next/server";
import { validateQuote } from "@/lib/quote";
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin)
    return NextResponse.json(
      { message: "Origem da solicitação inválida." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return NextResponse.json({ message: "Formato inválido." }, { status: 415 });
  if (Number(request.headers.get("content-length") || 0) > 16000)
    return NextResponse.json(
      { message: "Solicitação muito grande." },
      { status: 413 },
    );
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 16000)
      return NextResponse.json(
        { message: "Solicitação muito grande." },
        { status: 413 },
      );
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
  }
  const result = validateQuote(body);
  if (Object.keys(result.errors).length || !result.data)
    return NextResponse.json(
      { message: "Confira os campos destacados.", errors: result.errors },
      { status: 422 },
    );
  if (result.data.company)
    return NextResponse.json(
      { message: "Solicitação não aceita." },
      { status: 400 },
    );
  const endpoint = process.env.QUOTE_WEBHOOK_URL;
  if (!endpoint)
    return NextResponse.json(
      {
        message:
          "O envio online ainda não está configurado. Nenhum dado foi enviado.",
      },
      { status: 503 },
    );
  try {
    if (new URL(endpoint).protocol !== "https:")
      throw new Error("Endpoint must use HTTPS");
    const { company: _, ...quote } = result.data;
    void _;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.QUOTE_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.QUOTE_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        ...quote,
        source: "cipola-website",
        receivedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(12000),
      redirect: "error",
    });
    if (!response.ok) throw new Error("Delivery rejected");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      {
        message:
          "Não foi possível confirmar o recebimento. Tente novamente mais tarde.",
      },
      { status: 502 },
    );
  }
}
