export async function openAICompatibleChat({
  baseUrl,
  apiKey,
  model,
  messages,
  temperature = 0.4,
  max_tokens = 1200
}) {
  if (!apiKey) {
    return {
      ok: false,
      status: 501,
      error: "AI_API_KEY not configured"
    };
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({ model, messages, temperature, max_tokens })
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: data?.error?.message || "Provider request failed",
      raw: data
    };
  }

  const content = data?.choices?.[0]?.message?.content || "";

  return {
    ok: true,
    status: 200,
    provider: "openai-compatible",
    model,
    content,
    raw: data
  };
}
