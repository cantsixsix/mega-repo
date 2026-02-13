import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createApp } from "../../../shared/app-runner/createApp.js";
import { runAI } from "../../../shared/ai/client.js";
import { renderPlainDocument } from "../../../shared/pdf/generateDocument.js";
import { basicDeliverabilityChecks } from "../../../shared/utils/dnsChecks.js";
import { memoryStore } from "../../../shared/storage/memoryStore.js";
import { generateId, generateReferralCode } from "../../../shared/utils/idGenerator.js";
import { generateEmbedSnippet, generateWallHtml } from "../../../shared/utils/embedRenderer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "../../..");
const specsPath = path.join(workspaceRoot, "apps", "specs.json");

const specs = JSON.parse(fs.readFileSync(specsPath, "utf8"));
const bySlug = new Map(specs.map((app) => [app.slug, app]));
const port = Number(process.env.PORT || 8790);

const gatewayUrl = process.env.AI_GATEWAY_URL || "http://localhost:8787/api/ai";
const model = process.env.DEFAULT_MODEL || "deepseek/deepseek-chat";

function toPrompt(template, input) {
  return template.replace("{{input}}", String(input || "Sem input fornecido"));
}

async function runDefaultAI(appSpec, input) {
  const ai = await runAI({
    gatewayUrl,
    model,
    system: "Responda em português com formato prático para produto SaaS.",
    prompt: toPrompt(appSpec.promptTemplate, input),
    fallback: true
  });

  if (!ai.ok) {
    return {
      ok: false,
      status: ai.status,
      body: {
        ok: false,
        app: appSpec.slug,
        error: ai.error,
        hint: "Configure AI_API_KEY no services/ai-gateway/.env"
      }
    };
  }

  return {
    ok: true,
    status: 200,
    body: {
      ok: true,
      app: appSpec.slug,
      provider: ai.provider,
      model: ai.model,
      output: ai.output
    }
  };
}

async function handleResume(appSpec, input) {
  const ai = await runAI({
    gatewayUrl,
    model,
    system: "Você é especialista em recrutamento. Entregue resposta objetiva e pronta para uso.",
    prompt: `${toPrompt(appSpec.promptTemplate, input)}\n\nFormato obrigatório:\n1) CV otimizado\n2) Principais palavras-chave\n3) Pontos de melhoria imediata`,
    fallback: true
  });

  if (!ai.ok) {
    return { ok: false, status: ai.status, body: { ok: false, app: appSpec.slug, error: ai.error } };
  }

  return {
    ok: true,
    status: 200,
    body: {
      ok: true,
      app: appSpec.slug,
      type: "resume-optimizer",
      output: ai.output
    }
  };
}

async function handleESG(appSpec, input) {
  const ai = await runAI({
    gatewayUrl,
    model,
    system: "Você é consultor ESG para PMEs. Seja prático e acionável.",
    prompt: `${toPrompt(appSpec.promptTemplate, input)}\n\nInclua: resumo executivo, riscos, ações em 30/60/90 dias.`,
    fallback: true
  });

  if (!ai.ok) {
    return { ok: false, status: ai.status, body: { ok: false, app: appSpec.slug, error: ai.error } };
  }

  const document = renderPlainDocument({
    title: "Relatório ESG Inicial",
    sections: [
      { heading: "Resumo", content: ai.output },
      { heading: "Próximos Passos", content: "Executar plano 30/60/90 dias e medir indicadores trimestralmente." }
    ]
  });

  return {
    ok: true,
    status: 200,
    body: {
      ok: true,
      app: appSpec.slug,
      type: "esg-report",
      output: ai.output,
      document
    }
  };
}

async function handlePitchDeck(appSpec, input) {
  const ai = await runAI({
    gatewayUrl,
    model,
    system: "Você é especialista em captação para startups early-stage.",
    prompt: `${toPrompt(appSpec.promptTemplate, input)}\n\nRetorne em 10 seções numeradas de slide.`,
    fallback: true
  });

  if (!ai.ok) {
    return { ok: false, status: ai.status, body: { ok: false, app: appSpec.slug, error: ai.error } };
  }

  const document = renderPlainDocument({
    title: "Pitch Deck - Roteiro Inicial",
    sections: [{ heading: "Slides", content: ai.output }]
  });

  return {
    ok: true,
    status: 200,
    body: {
      ok: true,
      app: appSpec.slug,
      type: "pitch-deck",
      output: ai.output,
      document
    }
  };
}

async function handleColdEmail(appSpec, input) {
  const ai = await runAI({
    gatewayUrl,
    model,
    system: "Você é especialista em outbound B2B. Escreva emails curtos e diretos.",
    prompt: `${toPrompt(appSpec.promptTemplate, input)}\n\nRetorne assunto + 3 variações de email com CTA final.`,
    fallback: true
  });

  if (!ai.ok) {
    return { ok: false, status: ai.status, body: { ok: false, app: appSpec.slug, error: ai.error } };
  }

  const checks = basicDeliverabilityChecks(ai.output);

  return {
    ok: true,
    status: 200,
    body: {
      ok: true,
      app: appSpec.slug,
      type: "cold-email-generator",
      output: ai.output,
      deliverability: checks
    }
  };
}

// ==================== APPS COM IA PURA ====================

async function handleScreenshotToCode(appSpec, input) {
  const ai = await runAI({
    gatewayUrl,
    model,
    system: "Você é frontend designer expert. Gere código React limpo e responsivo.",
    prompt: `${toPrompt(appSpec.promptTemplate, input)}\n\nRetorne o código completo entre \`\`\`jsx e \`\`\`. Inclua CSS inline nos componentes.`,
    fallback: true
  });

  if (!ai.ok) {
    return { ok: false, status: ai.status, body: { ok: false, app: appSpec.slug, error: ai.error } };
  }

  const codeMatch = ai.output.match(/```(?:jsx|javascript|react)?\n([\s\S]*?)```/);
  const code = codeMatch ? codeMatch[1].trim() : ai.output;
  
  const previewHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><script src="https://unpkg.com/react@18/umd/react.development.js"></script><script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script></head>
<body><div id="root"></div><script type="text/babel">${code}\nReactDOM.render(<App />, document.getElementById('root'));</script></body></html>`;

  return {
    ok: true,
    status: 200,
    body: { ok: true, app: appSpec.slug, type: "screenshot-to-code", output: ai.output, code, previewHtml }
  };
}

async function handleBrandKit(appSpec, input) {
  const ai = await runAI({
    gatewayUrl,
    model,
    system: "Você é brand strategist. Entregue guia de marca completo e acionável.",
    prompt: `${toPrompt(appSpec.promptTemplate, input)}\n\nInclua: missão, valores, tom de voz, paleta de cores (5 cores hex), fontes (primária e secundária), tagline, diretrizes de uso.`,
    fallback: true
  });

  if (!ai.ok) {
    return { ok: false, status: ai.status, body: { ok: false, app: appSpec.slug, error: ai.error } };
  }

  const hexPattern = /#[0-9A-Fa-f]{6}/g;
  const palette = [...new Set(ai.output.match(hexPattern) || [])].slice(0, 5);

  const document = renderPlainDocument({
    title: "Brand Kit",
    sections: [
      { heading: "Identidade", content: ai.output },
      { heading: "Paleta de Cores", content: palette.join(", ") || "Não detectada" }
    ]
  });

  return {
    ok: true,
    status: 200,
    body: { ok: true, app: appSpec.slug, type: "brand-kit", output: ai.output, document, palette }
  };
}

async function handleProposals(appSpec, input) {
  const ai = await runAI({
    gatewayUrl,
    model,
    system: "Você é consultor de negócios para freelancers. Gere proposta comercial profissional.",
    prompt: `${toPrompt(appSpec.promptTemplate, input)}\n\nInclua: resumo executivo, escopo detalhado, deliverables, cronograma, investimento, condições de pagamento, termos.`,
    fallback: true
  });

  if (!ai.ok) {
    return { ok: false, status: ai.status, body: { ok: false, app: appSpec.slug, error: ai.error } };
  }

  const document = renderPlainDocument({
    title: "Proposta Comercial",
    sections: [{ heading: "Proposta", content: ai.output }]
  });

  const proposalId = generateId("prop");
  memoryStore.create("proposals", { id: proposalId, content: ai.output, status: "draft" });

  return {
    ok: true,
    status: 200,
    body: { ok: true, app: appSpec.slug, type: "proposal", output: ai.output, document, proposalId }
  };
}

async function handleMeetingNotes(appSpec, input) {
  const data = typeof input === "object" ? input : { input };
  const niche = data.niche || "geral";
  
  const nichePrompts = {
    vendas: "Foque em: oportunidades identificadas, objeções, próximos passos comerciais, deal score (1-10).",
    medicina: "Formato SOAP: Subjetivo, Objetivo, Avaliação, Plano. Lista exames/prescrições.",
    legal: "Formato de minuta: participantes, deliberações, decisões, prazos, anexos mencionados.",
    geral: "Foque em: decisões, action items com responsável e prazo, pontos em aberto."
  };

  const ai = await runAI({
    gatewayUrl,
    model,
    system: `Você é especialista em documentação de reuniões no contexto ${niche}. ${nichePrompts[niche] || nichePrompts.geral}`,
    prompt: `${toPrompt(appSpec.promptTemplate, data.input)}\n\nRetorne estruturado: Resumo, Decisões, Action Items (formato: [Ação] - [Responsável] - [Prazo]).`,
    fallback: true
  });

  if (!ai.ok) {
    return { ok: false, status: ai.status, body: { ok: false, app: appSpec.slug, error: ai.error } };
  }

  const actionItemsMatch = ai.output.match(/Action Items?:?\s*([\s\S]*?)(?:\n\n|$)/i);
  const actionItemsText = actionItemsMatch ? actionItemsMatch[1] : "";
  const actionItems = actionItemsText.split("\n").filter(Boolean).slice(0, 10);

  return {
    ok: true,
    status: 200,
    body: { ok: true, app: appSpec.slug, type: "meeting-notes", niche, output: ai.output, actionItems }
  };
}

async function handleChangelog(appSpec, input) {
  const ai = await runAI({
    gatewayUrl,
    model,
    system: "Você é DevRel writer expert. Escreva release notes claras e user-facing.",
    prompt: `${toPrompt(appSpec.promptTemplate, input)}\n\nCategorize em: Added (novos recursos), Improved (melhorias), Fixed (correções). Máximo 3 itens por categoria.`,
    fallback: true
  });

  if (!ai.ok) {
    return { ok: false, status: ai.status, body: { ok: false, app: appSpec.slug, error: ai.error } };
  }

  const releaseId = generateId("rel");
  const release = {
    id: releaseId,
    content: ai.output,
    version: `v${Date.now()}`,
    publishedAt: new Date().toISOString()
  };
  memoryStore.create("changelogs", release);

  return {
    ok: true,
    status: 200,
    body: { ok: true, app: appSpec.slug, type: "changelog", output: ai.output, releaseId, version: release.version }
  };
}

async function handlePodcast(appSpec, input) {
  const ai = await runAI({
    gatewayUrl,
    model,
    system: "Você é produtor de podcast expert. Entregue conteúdo pronto para distribuição.",
    prompt: `${toPrompt(appSpec.promptTemplate, input)}\n\nRetorne: Show Notes (com timestamps [00:00]), 5 Highlights/Quotes, Rascunho de Newsletter, 3 Sugestões de Títulos para Clips Sociais.`,
    fallback: true
  });

  if (!ai.ok) {
    return { ok: false, status: ai.status, body: { ok: false, app: appSpec.slug, error: ai.error } };
  }

  const highlightsMatch = ai.output.match(/Highlights?:?\s*([\s\S]*?)(?:\n\n|Newsletter|$)/i);
  const highlights = highlightsMatch ? highlightsMatch[1].split("\n").filter(Boolean).slice(0, 5) : [];

  const document = renderPlainDocument({
    title: "Podcast Episode Notes",
    sections: [{ heading: "Show Notes", content: ai.output }]
  });

  return {
    ok: true,
    status: 200,
    body: { ok: true, app: appSpec.slug, type: "podcast", output: ai.output, highlights, document }
  };
}

async function handleSocialProof(appSpec, input) {
  const ai = await runAI({
    gatewayUrl,
    model,
    system: "Você é copywriter de conversão expert. Escreva mensagens curtas e persuasivas.",
    prompt: `${toPrompt(appSpec.promptTemplate, input)}\n\nGere 5 mensagens de popup social proof (40-50 caracteres cada). Variações: compra recente, signup, review positiva, milestone alcançado, urgência.`,
    fallback: true
  });

  if (!ai.ok) {
    return { ok: false, status: ai.status, body: { ok: false, app: appSpec.slug, error: ai.error } };
  }

  const popups = ai.output.split("\n").filter(Boolean).slice(0, 5);
  const campaignId = generateId("sp");
  const embedSnippet = generateEmbedSnippet({ appSlug: "social-proof", targetId: "social-proof-widget" });

  memoryStore.create("social-proof-campaigns", { id: campaignId, popups, input });

  return {
    ok: true,
    status: 200,
    body: { ok: true, app: appSpec.slug, type: "social-proof", output: ai.output, popups, embedSnippet, campaignId }
  };
}

async function handlePriceMonitor(appSpec, input) {
  const data = typeof input === "object" ? input : { input };
  const prices = data.prices || [];

  if (prices.length > 0) {
    const monitorId = generateId("pm");
    memoryStore.create("price-snapshots", { id: monitorId, prices, timestamp: new Date().toISOString() });
  }

  const priceHistory = memoryStore.list("price-snapshots");
  const pricesText = JSON.stringify(prices.length > 0 ? prices : priceHistory.slice(-5), null, 2);

  const ai = await runAI({
    gatewayUrl,
    model,
    system: "Você é estrategista de pricing B2B. Analise tendências e sugira posicionamento.",
    prompt: `Analise estes preços de concorrentes:\n${pricesText}\n\nRetorne: análise comparativa, tendências detectadas, posicionamento sugerido, 3 recomendações táticas.`,
    fallback: true
  });

  if (!ai.ok) {
    return { ok: false, status: ai.status, body: { ok: false, app: appSpec.slug, error: ai.error } };
  }

  return {
    ok: true,
    status: 200,
    body: { ok: true, app: appSpec.slug, type: "price-monitor", output: ai.output, priceHistory: priceHistory.length, latestPrices: prices }
  };
}

// ==================== APPS RULE-BASED (CRUD) ====================

async function handleWaitlist(_appSpec, input) {
  console.log("[handleWaitlist] input type:", typeof input, "value:", JSON.stringify(input));
  const data = typeof input === "object" ? input : { action: "status" };
  const action = data.action || "subscribe";

  if (action === "subscribe") {
    const email = data.email || `user${Date.now()}@example.com`;
    const name = data.name || "User";
    const referredBy = data.referralCode || null;
    const referralCode = generateReferralCode();
    
    const subscriber = {
      id: generateId("sub"),
      email,
      name,
      referralCode,
      referredBy,
      referrals: 0
    };

    memoryStore.create("waitlist", subscriber);

    if (referredBy) {
      const referrer = memoryStore.list("waitlist").find((s) => s.referralCode === referredBy);
      if (referrer) {
        memoryStore.update("waitlist", referrer.id, { referrals: (referrer.referrals || 0) + 1 });
      }
    }

    const all = memoryStore.list("waitlist").sort((a, b) => {
      const scoreA = new Date(a.createdAt).getTime() - (a.referrals || 0) * 86400000;
      const scoreB = new Date(b.createdAt).getTime() - (b.referrals || 0) * 86400000;
      return scoreA - scoreB;
    });

    const position = all.findIndex((s) => s.id === subscriber.id) + 1;

    return {
      ok: true,
      status: 200,
      body: { ok: true, app: "waitlist", action: "subscribe", subscriber, position, totalWaiting: all.length, referralCode }
    };
  }

  if (action === "status") {
    const email = data.email;
    const subscriber = memoryStore.list("waitlist").find((s) => s.email === email || s.referralCode === data.referralCode);
    if (!subscriber) {
      return { ok: false, status: 404, body: { ok: false, error: "Subscriber not found" } };
    }

    const all = memoryStore.list("waitlist").sort((a, b) => {
      const scoreA = new Date(a.createdAt).getTime() - (a.referrals || 0) * 86400000;
      const scoreB = new Date(b.createdAt).getTime() - (b.referrals || 0) * 86400000;
      return scoreA - scoreB;
    });

    const position = all.findIndex((s) => s.id === subscriber.id) + 1;

    return {
      ok: true,
      status: 200,
      body: { ok: true, app: "waitlist", action: "status", subscriber, position, referrals: subscriber.referrals, totalWaiting: all.length }
    };
  }

  if (action === "leaderboard") {
    const top = memoryStore.list("waitlist").sort((a, b) => (b.referrals || 0) - (a.referrals || 0)).slice(0, 10);
    return {
      ok: true,
      status: 200,
      body: { ok: true, app: "waitlist", action: "leaderboard", leaderboard: top }
    };
  }

  return { ok: false, status: 400, body: { ok: false, error: "Unknown action" } };
}

async function handleJobBoard(_appSpec, input) {
  const data = typeof input === "object" ? input : { action: "list" };
  const action = data.action || "list";

  if (action === "post") {
    const job = {
      id: generateId("job"),
      title: data.job?.title || "Untitled Job",
      company: data.job?.company || "Company",
      location: data.job?.location || "Remote",
      type: data.job?.type || "Full-time",
      salary: data.job?.salary || "Competitive",
      description: data.job?.description || "",
      status: "active"
    };
    memoryStore.create("jobs", job);
    return { ok: true, status: 200, body: { ok: true, app: "job-board", action: "post", job } };
  }

  if (action === "list") {
    const jobs = memoryStore.list("jobs", (j) => j.status === "active");
    return { ok: true, status: 200, body: { ok: true, app: "job-board", action: "list", jobs, total: jobs.length } };
  }

  if (action === "get") {
    const job = memoryStore.get("jobs", data.jobId);
    if (!job) {
      return { ok: false, status: 404, body: { ok: false, error: "Job not found" } };
    }
    return { ok: true, status: 200, body: { ok: true, app: "job-board", action: "get", job } };
  }

  if (action === "apply") {
    const application = {
      id: generateId("app"),
      jobId: data.jobId,
      name: data.application?.name || "Applicant",
      email: data.application?.email || "applicant@example.com",
      coverLetter: data.application?.coverLetter || ""
    };
    memoryStore.create("applications", application);
    return { ok: true, status: 200, body: { ok: true, app: "job-board", action: "apply", application } };
  }

  return { ok: false, status: 400, body: { ok: false, error: "Unknown action" } };
}

async function handleClientPortal(_appSpec, input) {
  const data = typeof input === "object" ? input : { action: "list-projects" };
  const action = data.action || "list-projects";

  if (action === "create-project") {
    const project = {
      id: generateId("proj"),
      name: data.project?.name || "New Project",
      client: data.project?.client || "Client",
      description: data.project?.description || "",
      status: "em andamento",
      messages: [],
      files: []
    };
    memoryStore.create("projects", project);
    return { ok: true, status: 200, body: { ok: true, app: "client-portal", action: "create-project", project } };
  }

  if (action === "list-projects") {
    const projects = memoryStore.list("projects");
    return { ok: true, status: 200, body: { ok: true, app: "client-portal", action: "list-projects", projects, total: projects.length } };
  }

  if (action === "update-status") {
    const project = memoryStore.update("projects", data.projectId, { status: data.status });
    if (!project) {
      return { ok: false, status: 404, body: { ok: false, error: "Project not found" } };
    }
    return { ok: true, status: 200, body: { ok: true, app: "client-portal", action: "update-status", project } };
  }

  if (action === "add-message") {
    const project = memoryStore.get("projects", data.projectId);
    if (!project) {
      return { ok: false, status: 404, body: { ok: false, error: "Project not found" } };
    }
    const message = { from: data.message?.from || "System", content: data.message?.content || "", timestamp: new Date().toISOString() };
    project.messages.push(message);
    memoryStore.update("projects", data.projectId, project);
    return { ok: true, status: 200, body: { ok: true, app: "client-portal", action: "add-message", message } };
  }

  if (action === "get-project") {
    const project = memoryStore.get("projects", data.projectId);
    if (!project) {
      return { ok: false, status: 404, body: { ok: false, error: "Project not found" } };
    }
    return { ok: true, status: 200, body: { ok: true, app: "client-portal", action: "get-project", project } };
  }

  return { ok: false, status: 400, body: { ok: false, error: "Unknown action" } };
}

async function handleSubBox(_appSpec, input) {
  const data = typeof input === "object" ? input : { action: "list-plans" };
  const action = data.action || "list-plans";

  if (action === "create-plan") {
    const plan = {
      id: generateId("plan"),
      name: data.plan?.name || "Basic Plan",
      description: data.plan?.description || "",
      price: data.plan?.price || 29.99,
      interval: data.plan?.interval || "monthly",
      active: true
    };
    memoryStore.create("subscription-plans", plan);
    return { ok: true, status: 200, body: { ok: true, app: "sub-box", action: "create-plan", plan } };
  }

  if (action === "list-plans") {
    const plans = memoryStore.list("subscription-plans", (p) => p.active);
    return { ok: true, status: 200, body: { ok: true, app: "sub-box", action: "list-plans", plans } };
  }

  if (action === "subscribe") {
    const subscriber = {
      id: generateId("subscriber"),
      name: data.subscriber?.name || "Subscriber",
      email: data.subscriber?.email || "subscriber@example.com",
      planId: data.planId,
      status: "active",
      startDate: new Date().toISOString(),
      nextBilling: new Date(Date.now() + 30 * 86400000).toISOString()
    };
    memoryStore.create("subscribers", subscriber);
    return { ok: true, status: 200, body: { ok: true, app: "sub-box", action: "subscribe", subscriber } };
  }

  if (action === "list-subscribers") {
    const subscribers = memoryStore.list("subscribers", (s) => !data.planId || s.planId === data.planId);
    return { ok: true, status: 200, body: { ok: true, app: "sub-box", action: "list-subscribers", subscribers } };
  }

  return { ok: false, status: 400, body: { ok: false, error: "Unknown action" } };
}

async function handleNotionBlog(_appSpec, input) {
  const data = typeof input === "object" ? input : { action: "list-posts" };
  const action = data.action || "list-posts";

  if (action === "create-post") {
    const post = {
      id: generateId("post"),
      title: data.post?.title || "Untitled Post",
      content: data.post?.content || "",
      slug: data.post?.slug || `post-${Date.now()}`,
      tags: data.post?.tags || [],
      metaDescription: data.post?.metaDescription || "",
      published: false
    };
    memoryStore.create("blog-posts", post);
    return { ok: true, status: 200, body: { ok: true, app: "notion-blog", action: "create-post", post } };
  }

  if (action === "list-posts") {
    const posts = memoryStore.list("blog-posts");
    return { ok: true, status: 200, body: { ok: true, app: "notion-blog", action: "list-posts", posts } };
  }

  if (action === "get-post") {
    const post = memoryStore.get("blog-posts", data.postId) || memoryStore.list("blog-posts").find((p) => p.slug === data.slug);
    if (!post) {
      return { ok: false, status: 404, body: { ok: false, error: "Post not found" } };
    }
    return { ok: true, status: 200, body: { ok: true, app: "notion-blog", action: "get-post", post } };
  }

  if (action === "update-post") {
    const post = memoryStore.update("blog-posts", data.postId, data.updates);
    if (!post) {
      return { ok: false, status: 404, body: { ok: false, error: "Post not found" } };
    }
    return { ok: true, status: 200, body: { ok: true, app: "notion-blog", action: "update-post", post } };
  }

  return { ok: false, status: 400, body: { ok: false, error: "Unknown action" } };
}

// ==================== APPS HÍBRIDOS (CRUD + IA) ====================

async function handleTestimonials(_appSpec, input) {
  const data = typeof input === "object" ? input : { action: "list" };
  const action = data.action || "list";

  if (action === "submit") {
    const testimonial = {
      id: generateId("test"),
      author: data.testimonial?.author || "Anonymous",
      role: data.testimonial?.role || "",
      company: data.testimonial?.company || "",
      text: data.testimonial?.text || "",
      rating: data.testimonial?.rating || 5,
      status: "pending"
    };
    memoryStore.create("testimonials", testimonial);
    return { ok: true, status: 200, body: { ok: true, app: "testimonials", action: "submit", testimonial } };
  }

  if (action === "list") {
    const testimonials = memoryStore.list("testimonials", (t) => !data.status || t.status === data.status);
    return { ok: true, status: 200, body: { ok: true, app: "testimonials", action: "list", testimonials } };
  }

  if (action === "approve") {
    const testimonial = memoryStore.update("testimonials", data.testimonialId, { status: "approved" });
    if (!testimonial) {
      return { ok: false, status: 404, body: { ok: false, error: "Testimonial not found" } };
    }
    return { ok: true, status: 200, body: { ok: true, app: "testimonials", action: "approve", testimonial } };
  }

  if (action === "wall") {
    const approved = memoryStore.list("testimonials", (t) => t.status === "approved");
    const wallHtml = generateWallHtml(approved, { title: "Wall of Love" });
    return { ok: true, status: 200, body: { ok: true, app: "testimonials", action: "wall", wallHtml, count: approved.length } };
  }

  if (action === "summarize") {
    const testimonial = memoryStore.get("testimonials", data.testimonialId);
    if (!testimonial) {
      return { ok: false, status: 404, body: { ok: false, error: "Testimonial not found" } };
    }

    const ai = await runAI({
      gatewayUrl,
      model,
      system: "Extraia a frase mais impactante e memorável.",
      prompt: `Depoimento: "${testimonial.text}"\n\nRetorne apenas a quote mais forte em 1 frase curta.`,
      fallback: true
    });

    if (!ai.ok) {
      return { ok: false, status: ai.status, body: { ok: false, app: "testimonials", error: ai.error } };
    }

    return { ok: true, status: 200, body: { ok: true, app: "testimonials", action: "summarize", testimonialId: data.testimonialId, highlight: ai.output } };
  }

  return { ok: false, status: 400, body: { ok: false, error: "Unknown action" } };
}

async function handleAnalytics(_appSpec, input) {
  const data = typeof input === "object" ? input : { action: "dashboard" };
  const action = data.action || "dashboard";
  const siteId = data.siteId || "default";

  if (action === "track") {
    const event = {
      id: generateId("evt"),
      siteId,
      page: data.event?.page || "/",
      referrer: data.event?.referrer || "",
      country: data.event?.country || "Unknown",
      device: data.event?.device || "desktop",
      sessionId: data.event?.sessionId || generateId("sess"),
      timestamp: new Date().toISOString()
    };
    memoryStore.create("analytics-events", event);
    return { ok: true, status: 200, body: { ok: true, app: "analytics", action: "track", tracked: true } };
  }

  if (action === "dashboard") {
    const events = memoryStore.list("analytics-events", (e) => e.siteId === siteId);
    const totalViews = events.length;
    const uniqueSessions = new Set(events.map((e) => e.sessionId)).size;
    
    const pageCounts = {};
    const referrerCounts = {};
    events.forEach((e) => {
      pageCounts[e.page] = (pageCounts[e.page] || 0) + 1;
      if (e.referrer) referrerCounts[e.referrer] = (referrerCounts[e.referrer] || 0) + 1;
    });

    const topPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topReferrers = Object.entries(referrerCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const last7Days = events.filter((e) => Date.now() - new Date(e.timestamp).getTime() < 7 * 86400000);
    const dailyViews = {};
    last7Days.forEach((e) => {
      const day = new Date(e.timestamp).toISOString().split("T")[0];
      dailyViews[day] = (dailyViews[day] || 0) + 1;
    });

    return {
      ok: true,
      status: 200,
      body: {
        ok: true,
        app: "analytics",
        action: "dashboard",
        dashboard: {
          totalViews,
          uniqueSessions,
          topPages: topPages.map(([page, views]) => ({ page, views })),
          topReferrers: topReferrers.map(([referrer, views]) => ({ referrer, views })),
          dailyViews: Object.entries(dailyViews).map(([date, views]) => ({ date, views }))
        }
      }
    };
  }

  if (action === "insights") {
    const events = memoryStore.list("analytics-events", (e) => e.siteId === siteId);
    const summary = `Total de ${events.length} visualizações, ${new Set(events.map((e) => e.sessionId)).size} sessões únicas nos últimos dados.`;

    const ai = await runAI({
      gatewayUrl,
      model,
      system: "Você é analista de dados web expert.",
      prompt: `Analise: ${summary}\n\nRetorne 3 insights acionáveis curtos (máximo 2 linhas cada).`,
      fallback: true
    });

    if (!ai.ok) {
      return { ok: false, status: ai.status, body: { ok: false, app: "analytics", error: ai.error } };
    }

    const insights = ai.output.split("\n").filter(Boolean).slice(0, 3);

    return { ok: true, status: 200, body: { ok: true, app: "analytics", action: "insights", insights } };
  }

  return { ok: false, status: 400, body: { ok: false, error: "Unknown action" } };
}

async function handleUptime(_appSpec, input) {
  const data = typeof input === "object" ? input : { action: "list-monitors" };
  const action = data.action || "list-monitors";

  if (action === "add-monitor") {
    const monitor = {
      id: generateId("mon"),
      url: data.monitor?.url || "https://example.com",
      name: data.monitor?.name || "Monitor",
      status: "unknown",
      checks: [],
      incidents: []
    };
    memoryStore.create("uptime-monitors", monitor);
    return { ok: true, status: 200, body: { ok: true, app: "uptime", action: "add-monitor", monitor } };
  }

  if (action === "list-monitors") {
    const monitors = memoryStore.list("uptime-monitors");
    return { ok: true, status: 200, body: { ok: true, app: "uptime", action: "list-monitors", monitors } };
  }

  if (action === "check") {
    const monitor = memoryStore.get("uptime-monitors", data.monitorId);
    if (!monitor) {
      return { ok: false, status: 404, body: { ok: false, error: "Monitor not found" } };
    }

    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(monitor.url, { signal: controller.signal });
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      const check = {
        timestamp: new Date().toISOString(),
        statusCode: response.status,
        responseTime,
        ok: response.ok
      };

      monitor.checks.push(check);
      monitor.status = response.ok ? "up" : "down";

      if (!response.ok) {
        monitor.incidents.push({ timestamp: check.timestamp, statusCode: response.status });
      }

      memoryStore.update("uptime-monitors", data.monitorId, monitor);

      return { ok: true, status: 200, body: { ok: true, app: "uptime", action: "check", check, currentStatus: monitor.status } };
    } catch (error) {
      const check = { timestamp: new Date().toISOString(), statusCode: 0, responseTime: Date.now() - startTime, ok: false, error: error.message };
      monitor.checks.push(check);
      monitor.status = "down";
      monitor.incidents.push({ timestamp: check.timestamp, error: error.message });
      memoryStore.update("uptime-monitors", data.monitorId, monitor);

      return { ok: true, status: 200, body: { ok: true, app: "uptime", action: "check", check, currentStatus: "down" } };
    }
  }

  if (action === "status-page") {
    const monitors = memoryStore.list("uptime-monitors");
    const statusPage = monitors.map((m) => {
      const recentChecks = m.checks.slice(-100);
      const upCount = recentChecks.filter((c) => c.ok).length;
      const uptime = recentChecks.length > 0 ? ((upCount / recentChecks.length) * 100).toFixed(2) : "0.00";
      return { id: m.id, name: m.name, url: m.url, status: m.status, uptime: `${uptime}%`, lastCheck: recentChecks[recentChecks.length - 1] };
    });

    return { ok: true, status: 200, body: { ok: true, app: "uptime", action: "status-page", statusPage } };
  }

  if (action === "diagnose") {
    const monitor = memoryStore.get("uptime-monitors", data.monitorId);
    if (!monitor) {
      return { ok: false, status: 404, body: { ok: false, error: "Monitor not found" } };
    }

    const lastIncident = monitor.incidents[monitor.incidents.length - 1];
    if (!lastIncident) {
      return { ok: true, status: 200, body: { ok: true, app: "uptime", action: "diagnose", diagnosis: "Nenhum incidente registrado." } };
    }

    const ai = await runAI({
      gatewayUrl,
      model,
      system: "Você é engenheiro de confiabilidade de sistemas (SRE).",
      prompt: `Incidente: URL ${monitor.url} retornou status ${lastIncident.statusCode || "timeout/error"} em ${lastIncident.timestamp}.\n\nDiagnostique a causa provável em 2-3 linhas e sugira verificações.`,
      fallback: true
    });

    if (!ai.ok) {
      return { ok: false, status: ai.status, body: { ok: false, app: "uptime", error: ai.error } };
    }

    return { ok: true, status: 200, body: { ok: true, app: "uptime", action: "diagnose", incident: lastIncident, diagnosis: ai.output } };
  }

  return { ok: false, status: 400, body: { ok: false, error: "Unknown action" } };
}

const runHandlers = {
  resume: handleResume,
  esg: handleESG,
  "pitch-deck": handlePitchDeck,
  "cold-email": handleColdEmail,
  "screenshot-to-code": handleScreenshotToCode,
  "brand-kit": handleBrandKit,
  proposals: handleProposals,
  "meeting-notes": handleMeetingNotes,
  changelog: handleChangelog,
  podcast: handlePodcast,
  "social-proof": handleSocialProof,
  "price-monitor": handlePriceMonitor,
  waitlist: handleWaitlist,
  "job-board": handleJobBoard,
  "client-portal": handleClientPortal,
  "sub-box": handleSubBox,
  "notion-blog": handleNotionBlog,
  testimonials: handleTestimonials,
  analytics: handleAnalytics,
  uptime: handleUptime
};

const { app, start } = createApp({
  serviceName: "app-hub",
  port,
  registerRoutes(server) {
    // Servir arquivos estáticos da pasta public
    const publicPath = path.join(workspaceRoot, "public");
    server.use(express.static(publicPath));

    // Rota raiz serve o index.html
    server.get("/", (_req, res) => {
      res.sendFile(path.join(publicPath, "index.html"));
    });

    // Rotas específicas de apps servem os HTMLs
    server.get("/apps/:slug", (req, res, next) => {
      const htmlPath = path.join(publicPath, "apps", `${req.params.slug}.html`);
      if (fs.existsSync(htmlPath)) {
        return res.sendFile(htmlPath);
      }
      next(); // Se não existe HTML, vai para a rota API
    });

    // API: Listar todos os apps
    server.get("/api/apps", (_req, res) => {
      res.json({ ok: true, total: specs.length, apps: specs.map(({ promptTemplate, ...rest }) => rest) });
    });

    // API: Detalhes de um app
    server.get("/api/apps/:slug", (req, res) => {
      const appSpec = bySlug.get(req.params.slug);
      if (!appSpec) {
        return res.status(404).json({ ok: false, error: "app not found" });
      }

      return res.json({ ok: true, app: appSpec });
    });

    server.post("/apps/:slug/run", async (req, res) => {
      const appSpec = bySlug.get(req.params.slug);
      if (!appSpec) {
        return res.status(404).json({ ok: false, error: "app not found" });
      }

      const input = req.body?.input !== undefined ? req.body.input : (Object.keys(req.body || {}).length > 0 ? req.body : "Sem input fornecido");
      const handler = runHandlers[appSpec.slug];

      try {
        if (handler) {
          const result = await handler(appSpec, input);
          return res.status(result.status).json(result.body);
        }

        if (!appSpec.requiresAI) {
          return res.json({
            ok: true,
            mode: "rule-based",
            app: appSpec.slug,
            output: {
              summary: `MVP ${appSpec.name} executado sem IA externa.`,
              receivedInput: input,
              nextActions: ["persistir no banco", "expor dashboard", "adicionar billing"]
            }
          });
        }

        const result = await runDefaultAI(appSpec, input);
        return res.status(result.status).json(result.body);
      } catch (error) {
        return res.status(502).json({
          ok: false,
          app: appSpec.slug,
          error: error.message,
          hint: "Suba o ai-gateway em paralelo"
        });
      }
    });
  }
});

start();
