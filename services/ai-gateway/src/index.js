import "dotenv/config";
import express from "express";
import { openAICompatibleChat } from "./providers/openaiCompatible.js";

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "ai-gateway", ts: new Date().toISOString() });
});

app.post("/api/ai", async (req, res) => {
  try {
    const {
      provider = process.env.AI_PROVIDER || "openrouter",
      model = process.env.AI_MODEL || "deepseek/deepseek-chat",
      messages,
      temperature,
      max_tokens,
      fallback
    } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ ok: false, error: "messages is required" });
    }

    const primary = {
      baseUrl: req.body?.baseUrl || process.env.AI_BASE_URL || "https://openrouter.ai/api/v1",
      apiKey: req.body?.apiKey || process.env.AI_API_KEY,
      model,
      messages,
      temperature,
      max_tokens
    };

    const primaryResult = await openAICompatibleChat(primary);

    if (primaryResult.ok) {
      return res.json({ ok: true, provider, model, output: primaryResult.content, raw: primaryResult.raw });
    }

    const fallbackEnabled = Boolean(fallback) || Boolean(process.env.AI_FALLBACK_PROVIDER);
    if (!fallbackEnabled) {
      return res.status(primaryResult.status || 500).json(primaryResult);
    }

    const fallbackResult = await openAICompatibleChat({
      baseUrl: process.env.AI_FALLBACK_BASE_URL || "https://openrouter.ai/api/v1",
      apiKey: process.env.AI_FALLBACK_API_KEY,
      model: process.env.AI_FALLBACK_MODEL || "google/gemini-2.0-flash-001",
      messages,
      temperature,
      max_tokens
    });

    if (fallbackResult.ok) {
      return res.json({
        ok: true,
        fallback: true,
        provider: process.env.AI_FALLBACK_PROVIDER || "openrouter",
        model: process.env.AI_FALLBACK_MODEL || "google/gemini-2.0-flash-001",
        output: fallbackResult.content,
        raw: fallbackResult.raw
      });
    }

    return res.status(fallbackResult.status || 500).json(fallbackResult);
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message || "unknown error" });
  }
});

app.listen(port, () => {
  console.log(`[ai-gateway] listening on http://localhost:${port}`);
});
