import express from "express";

export function createApp({ serviceName, port, registerRoutes }) {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, service: serviceName, ts: new Date().toISOString() });
  });

  if (typeof registerRoutes === "function") {
    registerRoutes(app);
  }

  app.use((err, _req, res, _next) => {
    res.status(500).json({ ok: false, service: serviceName, error: err?.message || "internal error" });
  });

  return {
    app,
    start() {
      app.listen(port, () => {
        console.log(`[${serviceName}] listening on http://localhost:${port}`);
      });
    }
  };
}
