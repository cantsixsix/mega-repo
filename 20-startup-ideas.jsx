import { useState } from "react";

const ideas = [
  {
    id: 1, name: "AI Screenshot-to-Code Landing Page Builder",
    desc: "Upload screenshot de qualquer site → IA gera codigo HTML/CSS/React funcional. Focado em landing pages para makers/founders.",
    cost: "$0-20/mes", time: "2-3 sem", mrrPotential: "$10-30k", difficulty: "Media",
    proof: "Mattia Pomelli fez tool de design AI e bateu $10k MRR em 6 semanas (IndieHackers Jan 2026)",
    competitors: "Screenshot-to-Code (open source), Locofy, Figma-to-code plugins",
    gap: "Nenhum focado especificamente em landing pages com templates prontos + otimizacao de conversao",
    stack: "Next.js + Claude API + Vercel", selected: true, rank: 1
  },
  {
    id: 2, name: "AI Cold Email Writer + Deliverability Checker",
    desc: "Escreve cold emails personalizados por IA + verifica se vai cair no spam. Combo unico.",
    cost: "$20/mes", time: "3-4 sem", mrrPotential: "$15-50k", difficulty: "Media",
    proof: "Instantly.ai bootstrapped p/ multi-million ARR. Lemlist $23M ARR. Rob Hallam $23k MRR em 6 meses com leadgen tool",
    competitors: "Instantly, Lemlist, Apollo, Smartlead",
    gap: "Nenhum combina escrita AI + deliverability check + warmup em produto simples a $29/mes. Todos sao suites caras",
    stack: "Next.js + Claude API + DNS checks + Resend", selected: true, rank: 2
  },
  {
    id: 3, name: "Testimonial Video Collector + Wall",
    desc: "Link que cliente abre → grava video depoimento → aparece em wall bonita no seu site. Zero fricção.",
    cost: "$10/mes", time: "2-3 sem", mrrPotential: "$10-25k", difficulty: "Baixa",
    proof: "Senja.io bateu $1M ARR focando so em coleta de testimonials. VideoAsk (Typeform) prova demanda",
    competitors: "Senja, Testimonial.to, VideoAsk, TrustPilot",
    gap: "Senja foca em texto. VideoAsk e caro ($30+). Ninguem tem video-first + AI highlights + wall embed por $19/mes",
    stack: "Next.js + WebRTC + Cloudflare R2 + embed script", selected: true, rank: 3
  },
  {
    id: 4, name: "AI Proposal/Invoice Generator para Freelancers",
    desc: "Descreve o projeto em 1 paragrafo → IA gera proposta profissional completa + contrato + invoice. PDF lindo.",
    cost: "$5/mes", time: "2-3 sem", mrrPotential: "$10-30k", difficulty: "Baixa",
    proof: "Bonsai ($5M+ ARR) e HoneyBook ($100M+) provam que freelancers pagam por admin tools. Mercado freelance $4.16B",
    competitors: "Bonsai, HoneyBook, AND.CO, FreshBooks",
    gap: "Todos sao suites pesadas $20-40/mes. Ninguem tem AI-first proposal em <5min por $9/mes",
    stack: "Next.js + Claude API + PDF generation + Stripe", selected: true, rank: 4
  },
  {
    id: 5, name: "Niche Job Board Builder (White-Label)",
    desc: "Plataforma p/ criar job boards especializados em qualquer nicho. Monetiza com postagens pagas ($99-299/vaga).",
    cost: "$15/mes", time: "3-4 sem", mrrPotential: "$5-25k", difficulty: "Media",
    proof: "RemoteOK gera $2.5M+/ano. WeWorkRemotely vendido por milhoes. Nichos inexplorados: energia solar, cannabis, AI safety",
    competitors: "RemoteOK, WeWorkRemotely, Wellfound, job board generico",
    gap: "Ninguem oferece job board white-label self-serve por $49/mes para criar nicho boards",
    stack: "Next.js + Supabase + Stripe + SEO", selected: true, rank: 5
  },
  {
    id: 6, name: "AI Changelog + Release Notes Generator",
    desc: "Conecta ao GitHub → detecta PRs/commits → gera changelog bonito publico + email pra users automaticamente.",
    cost: "$5/mes", time: "2 sem", mrrPotential: "$5-15k", difficulty: "Baixa",
    proof: "Beamer vendido por estimado $10M+. LaunchNotes raised $25M. ChangeFeed $5k+ MRR bootstrapped",
    competitors: "Beamer, LaunchNotes, Headway, ChangeFeed",
    gap: "Nenhum gera changelog AUTOMATICAMENTE do GitHub com AI. Todos requerem escrita manual. $19/mes self-serve",
    stack: "Next.js + GitHub API + Claude API + email", selected: true, rank: 6
  },
  {
    id: 7, name: "Cookie-Less Analytics Dashboard (GDPR-Compliant)",
    desc: "Analytics simples, bonito, sem cookies, GDPR-compliant. Alternativa ao Google Analytics para quem quer compliance.",
    cost: "$10/mes", time: "3-4 sem", mrrPotential: "$10-40k", difficulty: "Media",
    proof: "Plausible Analytics bootstrapped p/ $100k+ MRR. Fathom Analytics $400k+ MRR. Simpleanalytics $20k+ MRR",
    competitors: "Plausible ($9/mes), Fathom ($14/mes), Simple Analytics, Pirsch, Umami (open source)",
    gap: "Mercado validado MAS todos ignoram: AI insights automaticos + integracao com GEO tracking + alertas inteligentes",
    stack: "Go/Rust + ClickHouse + Next.js", selected: true, rank: 7
  },
  {
    id: 8, name: "AI Meeting Notes para Nichos (Vendas/Medicina/Legal)",
    desc: "Transcreve + resume reunioes com outputs especificos por vertical: follow-ups de venda, notas medicas, minutas legais.",
    cost: "$20/mes", time: "3-4 sem", mrrPotential: "$15-50k", difficulty: "Media",
    proof: "Fireflies.ai $10M+ ARR. Otter.ai massive. Mercado meeting AI $3.24B → $7.33B ate 2035",
    competitors: "Fireflies, Otter.ai, tl;dv, Fathom, Grain",
    gap: "TODOS sao genericos. Ninguem faz meeting notes especifico para imobiliarias, dentistas, ou advogados com templates",
    stack: "Next.js + Whisper API + Claude API + Zoom/Meet API", selected: true, rank: 8
  },
  {
    id: 9, name: "Waitlist + Launch Page Builder com Viral Referral",
    desc: "Crie waitlist com referral embutido (convide amigos = suba na fila). Widget integravel em qualquer site.",
    cost: "$5/mes", time: "1-2 sem", mrrPotential: "$5-15k", difficulty: "Baixa",
    proof: "Viral Loops $1M+ ARR. LaunchRock millions de users. Getwaitlist crescendo rapido",
    competitors: "Viral Loops, GetWaitlist, LaunchList, Waitlist.me",
    gap: "Viral Loops e caro ($49+). GetWaitlist e basico. Ninguem combina waitlist + landing page + analytics + A/B test por $19/mes",
    stack: "Next.js + Supabase + embed widget", selected: true, rank: 9
  },
  {
    id: 10, name: "AI Brand Kit Generator (Logo + Cores + Fontes + Guia)",
    desc: "Descreve seu negocio → IA gera brand kit completo: logo, paleta de cores, tipografia, guia de uso, social media templates.",
    cost: "$10/mes", time: "2-3 sem", mrrPotential: "$10-30k", difficulty: "Media",
    proof: "Looka $10M+ ARR (logo AI). Brandmark similar. Midjourney $200M+ ARR prova demanda por AI visual",
    competitors: "Looka, Brandmark, Hatchful (Shopify), Canva",
    gap: "Looka = so logo ($65 one-time). Ninguem gera BRAND KIT COMPLETO (logo+cores+fonte+guia+templates) por $29/mes",
    stack: "Next.js + Stability AI/DALL-E + Claude + PDF generation", selected: true, rank: 10
  },
  {
    id: 11, name: "Client Portal para Agencias/Freelancers",
    desc: "Portal white-label onde agencias compartilham entregas, status, mensagens com clientes. Alternativa ao notion/drive.",
    cost: "$10/mes", time: "3-4 sem", mrrPotential: "$10-25k", difficulty: "Media",
    proof: "Senja.io ($1M ARR) fez isso p/ testimonials. Mercado freelance management $4.16B → $9.24B",
    competitors: "Notion, Dubsado, Plutio, ClientVenue",
    gap: "Todos sao suites gordas. Ninguem faz portal SIMPLES com status + files + chat por $19/mes",
    stack: "Next.js + Supabase + Resend", selected: false, rank: null
  },
  {
    id: 12, name: "AI Social Proof Popup Widget",
    desc: "Widget que mostra notificacoes reais (compras, signups, reviews) no seu site. Aumenta conversao 10-15%.",
    cost: "$5/mes", time: "1-2 sem", mrrPotential: "$5-15k", difficulty: "Baixa",
    proof: "ProveSource, Fomo, UseProof — todos lucrando. Prova social aumenta conversao 10-15% (dados de mercado)",
    competitors: "ProveSource ($29+), Fomo ($25+), UseProof (caro), Evidence",
    gap: "Todos cobram $25+. AI pode gerar copy otimizada para cada popup. $9/mes com AI-powered messaging",
    stack: "Vanilla JS widget + Next.js dashboard + Stripe", selected: false, rank: null
  },
  {
    id: 13, name: "Subscription Box Toolkit (p/ Creators)",
    desc: "Plataforma simples p/ creators/marcas criarem subscription boxes: gestao, pagamento recorrente, fulfillment.",
    cost: "$15/mes", time: "4-5 sem", mrrPotential: "$5-20k", difficulty: "Media",
    proof: "Cratejoy vendido. Subbly $2M+ ARR. Box subscriptions = mercado de $35B",
    competitors: "Subbly, Cratejoy, Shopify Subscriptions",
    gap: "Subbly e lento e caro. Cratejoy morreu. Oportunidade para tool leve focado em creators/pequenas marcas",
    stack: "Next.js + Stripe Billing + Supabase", selected: false, rank: null
  },
  {
    id: 14, name: "AI Resume/CV Optimizer por Vaga",
    desc: "Cola a vaga + seu CV → IA reescreve CV otimizado para aquela vaga especifica. ATS-friendly score.",
    cost: "$5/mes", time: "2 sem", mrrPotential: "$10-30k", difficulty: "Baixa",
    proof: "Resume.io $25M+ ARR. Teal $10M+ funding. Mercado de $1.5B crescendo",
    competitors: "Resume.io, Teal, Jobscan, Rezi",
    gap: "Nenhum faz otimizacao POR VAGA em tempo real com AI. Todos sao templates estaticos. $9/mes ou $4.99/otimizacao",
    stack: "Next.js + Claude API + PDF parser", selected: false, rank: null
  },
  {
    id: 15, name: "ESG/Sustainability Report Generator para PMEs",
    desc: "PMEs geram relatorios ESG automaticamente: questionario simples → relatorio profissional PDF. Compliance obrigatorio em 2026+.",
    cost: "$10/mes", time: "3-4 sem", mrrPotential: "$10-30k", difficulty: "Media",
    proof: "ESG reporting obrigatorio para Fortune 500 em 2026. PMEs proximas. Mercado compliance ESG $15B+",
    competitors: "Watershed, Persefoni, Plan A (todos enterprise $2k+/mes)",
    gap: "ZERO opcao acessivel para PMEs. Todos sao enterprise. $99-199/mes para relatorio automatizado",
    stack: "Next.js + Claude API + PDF gen + questionario guiado", selected: false, rank: null
  },
  {
    id: 16, name: "AI Podcast Show Notes + Clips Generator",
    desc: "Upload audio → gera show notes, timestamps, highlights, 5 clips para social media, blog post, newsletter draft.",
    cost: "$15/mes", time: "2-3 sem", mrrPotential: "$10-30k", difficulty: "Media",
    proof: "OpusClip $1M ARR em 14 dias (clips). Podium criou mercado podcast tools. 5M+ podcasts ativos",
    competitors: "OpusClip, Descript, Castmagic, Podium",
    gap: "OpusClip = video-first. Descript = caro/complexo. Ninguem faz audio-first show notes + newsletter + clips tudo junto $19/mes",
    stack: "Next.js + Whisper + Claude + FFmpeg", selected: false, rank: null
  },
  {
    id: 17, name: "Notion-to-Blog / Notion-to-Site Converter",
    desc: "Converte paginas do Notion em blog/site publico com dominio custom, SEO, analytics. Zero code.",
    cost: "$10/mes", time: "2-3 sem", mrrPotential: "$5-20k", difficulty: "Media",
    proof: "Super.so ~$1M ARR. Potion.so crescendo. Notion tem 35M+ users",
    competitors: "Super.so ($16/mes), Potion.so, Oopy, NotionPress",
    gap: "Super.so cobra $16/site. Pode fazer $7/site com melhor SEO + AI-generated meta tags + faster load",
    stack: "Next.js + Notion API + Vercel + custom domains", selected: false, rank: null
  },
  {
    id: 18, name: "AI Competitor Price Monitor",
    desc: "Monitora precos de concorrentes automaticamente + alerta quando mudam + sugere ajuste de precos com AI.",
    cost: "$15/mes", time: "3-4 sem", mrrPotential: "$10-30k", difficulty: "Media",
    proof: "Prisync $3M+ ARR. Competera raised $14M. E-commerce precisa disso desesperadamente",
    competitors: "Prisync ($99+), Competera (enterprise), Price2Spy",
    gap: "Todos enterprise/$99+. Ninguem faz para Shopify stores pequenas por $29/mes com AI recommendations",
    stack: "Next.js + Puppeteer/scraping + Claude + Shopify API", selected: false, rank: null
  },
  {
    id: 19, name: "Uptime Monitor + Status Page com AI Diagnostics",
    desc: "Monitora uptime do seu site + gera status page publica + AI analisa logs quando cai e sugere fix.",
    cost: "$10/mes", time: "2-3 sem", mrrPotential: "$5-20k", difficulty: "Media",
    proof: "BetterUptime (Atlassian acquired). UptimeRobot milhoes de users. Pagerduty $2B+ market cap",
    competitors: "UptimeRobot (free), BetterUptime, Pingdom ($10+), StatusPage.io",
    gap: "Nenhum tem AI diagnostics que explica POR QUE caiu + sugere fix. $9/mes starter",
    stack: "Go cron worker + Next.js dashboard + Claude API", selected: false, rank: null
  },
  {
    id: 20, name: "AI Pitch Deck Generator",
    desc: "Responde 10 perguntas sobre seu negocio → IA gera pitch deck profissional completo com design, numeros, narrativa.",
    cost: "$10/mes", time: "2-3 sem", mrrPotential: "$10-30k", difficulty: "Media",
    proof: "Beautiful.ai $15M+ ARR. Tome $37M raised. 1M+ startups criadas/ano precisam de decks",
    competitors: "Beautiful.ai ($12/mes), Tome (free tier), Gamma, Slidebean ($29/mes)",
    gap: "Todos sao presentation tools genericos. Ninguem gera PITCH DECK COMPLETO de startup em 5 minutos por $19 one-shot",
    stack: "Next.js + Claude API + PPTX generation", selected: false, rank: null
  }
];

const difficultyColor = { "Baixa": "#22c55e", "Media": "#eab308", "Alta": "#ef4444" };

export default function StartupIdeas() {
  const [filter, setFilter] = useState("top10");
  const [expanded, setExpanded] = useState(null);

  const filtered = filter === "top10" ? ideas.filter(i => i.selected) : ideas;
  const totalMRR = ideas.filter(i => i.selected).reduce((sum, i) => {
    const match = i.mrrPotential.match(/\$(\d+)-(\d+)k/);
    return sum + (match ? (parseInt(match[1]) + parseInt(match[2])) / 2 * 1000 : 0);
  }, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a", color: "#e0e0e0", fontFamily: "'Inter', system-ui, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 12, letterSpacing: 4, color: "#E94560", fontWeight: 700, marginBottom: 8 }}>PORTFOLIO STRATEGY 2026</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>20 Startups Bootstrap-Ready</h1>
          <p style={{ color: "#888", fontSize: 14 }}>Top 10 selecionadas para implementação imediata</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Selecionadas", value: "10", color: "#22c55e" },
            { label: "MRR Potencial Total", value: `$${(totalMRR/1000).toFixed(0)}k`, color: "#E94560" },
            { label: "Custo Inicial Total", value: "<$100/mês", color: "#3b82f6" },
            { label: "Tempo até 1º Revenue", value: "2-4 sem", color: "#eab308" }
          ].map((s, i) => (
            <div key={i} style={{ background: "#111128", borderRadius: 12, padding: "16px 12px", textAlign: "center", border: "1px solid #1e1e3a" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["top10", "🏆 Top 10 (Implementar)"], ["all", "📋 Todas 20"]].map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)} style={{
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: filter === k ? "#E94560" : "#1e1e3a", color: filter === k ? "#fff" : "#888"
            }}>{label}</button>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((idea) => (
            <div key={idea.id} onClick={() => setExpanded(expanded === idea.id ? null : idea.id)}
              style={{
                background: idea.selected ? "linear-gradient(135deg, #111128 0%, #1a1a3e 100%)" : "#111128",
                borderRadius: 14, padding: "18px 20px", cursor: "pointer",
                border: idea.selected ? "1px solid #E94560" : "1px solid #1e1e3a",
                transition: "all 0.2s"
              }}>
              {/* Header row */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {idea.selected && (
                  <div style={{ background: "#E94560", color: "#fff", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>
                    {idea.rank}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{idea.name}</div>
                  <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>{idea.desc}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#22c55e" }}>{idea.mrrPotential}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>MRR potencial</div>
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                <span style={{ background: "#1e1e3a", padding: "3px 10px", borderRadius: 20, fontSize: 11, color: "#3b82f6" }}>⏱ {idea.time}</span>
                <span style={{ background: "#1e1e3a", padding: "3px 10px", borderRadius: 20, fontSize: 11, color: "#eab308" }}>💰 {idea.cost}</span>
                <span style={{ background: "#1e1e3a", padding: "3px 10px", borderRadius: 20, fontSize: 11, color: difficultyColor[idea.difficulty] }}>📊 {idea.difficulty}</span>
                <span style={{ background: "#1e1e3a", padding: "3px 10px", borderRadius: 20, fontSize: 11, color: "#a78bfa" }}>🛠 {idea.stack}</span>
              </div>

              {/* Expanded details */}
              {expanded === idea.id && (
                <div style={{ marginTop: 14, padding: "14px 16px", background: "#0d0d20", borderRadius: 10, fontSize: 13, lineHeight: 1.7 }}>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ color: "#22c55e", fontWeight: 700 }}>✅ Prova de mercado: </span>
                    <span style={{ color: "#ccc" }}>{idea.proof}</span>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ color: "#ef4444", fontWeight: 700 }}>⚔️ Concorrentes: </span>
                    <span style={{ color: "#ccc" }}>{idea.competitors}</span>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ color: "#E94560", fontWeight: 700 }}>🎯 Brecha pra você: </span>
                    <span style={{ color: "#fff", fontWeight: 600 }}>{idea.gap}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div style={{ marginTop: 32, background: "#111128", borderRadius: 14, padding: 24, border: "1px solid #1e1e3a" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 16px" }}>📅 Cronograma de Implementação (6 meses)</h2>
          {[
            { month: "Mês 1", items: "🔨 #1 Landing Page Builder + #6 Changelog Generator + #9 Waitlist Builder", color: "#22c55e" },
            { month: "Mês 2", items: "🔨 #3 Testimonial Collector + #4 Proposal Generator + Lancamentos PH", color: "#3b82f6" },
            { month: "Mês 3", items: "🔨 #2 Cold Email Writer + #7 Analytics Dashboard + Medir tração", color: "#a78bfa" },
            { month: "Mês 4", items: "🔨 #5 Job Board Builder + #8 Meeting Notes + Kill losers", color: "#eab308" },
            { month: "Mês 5", items: "🔨 #10 Brand Kit Generator + Scale winners (SEO + ads)", color: "#E94560" },
            { month: "Mês 6", items: "📊 ANÁLISE: Matar tudo <$1k MRR. Dobrar nos top 3. Avaliar funding.", color: "#fff" },
          ].map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ background: m.color + "22", color: m.color, padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 700, flexShrink: 0, minWidth: 60, textAlign: "center" }}>{m.month}</div>
              <div style={{ fontSize: 13, color: "#ccc", paddingTop: 3 }}>{m.items}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24, padding: 16, fontSize: 12, color: "#555" }}>
          Clique em qualquer card para ver concorrentes e brechas detalhadas • Fev 2026
        </div>
      </div>
    </div>
  );
}
