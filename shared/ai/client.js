export async function runAI({ gatewayUrl, model, prompt, system = "Responda em português com formato prático.", fallback = true }) {
  const response = await fetch(gatewayUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      fallback,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ]
    })
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: payload?.error || "ai request failed",
      raw: payload
    };
  }

  return {
    ok: true,
    status: 200,
    provider: payload.provider,
    model: payload.model,
    output: payload.output,
    raw: payload
  };
}
