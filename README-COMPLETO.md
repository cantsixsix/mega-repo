# Portfolio de 20 SaaS Apps - MVP Completo

Portfolio de 20 aplicações SaaS funcionais prontas para demonstração e venda.

## 🏗️ Arquitetura

```
monorepo/
├── services/
│   ├── ai-gateway/    # Gateway unificado para APIs de IA (porta 8787)
│   └── app-hub/       # Hub central com 20 handlers (porta 8790)
├── shared/            # Módulos compartilhados
│   ├── app-runner/    # Factory Express
│   ├── ai/client.js   # Cliente do AI Gateway
│   ├── pdf/           # Gerador de documentos
│   ├── utils/         # DNS checks, IDs, embed renderer
│   └── storage/       # MemoryStore (in-memory CRUD)
└── apps/              # 20 pastas de apps + specs.json
```

## ✅ 20 Apps Implementados

### 🤖 Apps com IA (8)
1. **resume** - Gerador de currículos ATS-optimized
2. **esg** - Calculadora de métricas ESG B2B
3. **pitch-deck** - Gerador de pitch decks estruturados
4. **cold-email** - Gerador de cold emails com deliverability checks
5. **screenshot-to-code** - Screenshot → código React
6. **brand-kit** - Gerador completo de identidade de marca
7. **proposals** - Propostas comerciais para freelancers
8. **meeting-notes** - Transcrição → notas estruturadas (Sales/Legal/Medicina)

### 📋 Apps Rule-Based / CRUD (8)
9. **waitlist** - Waitlist com referral system e gamification
10. **job-board** - Job board com candidaturas
11. **client-portal** - Portal de clientes com projetos e mensagens
12. **sub-box** - Gerenciador de assinaturas recorrentes
13. **notion-blog** - CMS de blog com SEO

### 🔀 Apps Híbridos (IA + CRUD) (4)
15. **testimonials** - Coletor de depoimentos com Wall of Love
16. **analytics** - Analytics cookieless com insights de IA
17. **uptime** - Monitoramento de uptime com diagnóstico de IA
18. **changelog** - Gerador de release notes com IA

### 🚀 Apps Pure-AI Bonus (3)
19. **podcast** - Show notes + highlights de podcasts
20. **social-proof** - Gerador de popups de social proof
21. **price-monitor** - Análise competitiva de pricing

---

## 🚀 Como Iniciar

### 1. Pré-requisitos
- Node.js 22+ (via WSL no Windows)
- npm 10+

### 2. Instalação
```bash
cd /mnt/c/Users/edenpc/Desktop/node
npm install
```

### 3. Configurar AI Gateway (opcional para apps com IA)

Copie `.env.example` e configure:
```bash
cd services/ai-gateway
cp .env.example .env
```

Edite `.env`:
```env
# Escolha um provider

# OPÇÃO 1: OpenRouter (recomendado - $0.06/1M tokens com DeepSeek)
AI_PRIMARY_PROVIDER=openai-compatible
AI_PRIMARY_API_KEY=sk-or-v1-...
AI_PRIMARY_BASE_URL=https://openrouter.ai/api/v1
AI_PRIMARY_MODEL=deepseek/deepseek-chat

# OPÇÃO 2: DeepSeek direto
# AI_PRIMARY_PROVIDER=openai-compatible
# AI_PRIMARY_API_KEY=sk-...
# AI_PRIMARY_BASE_URL=https://api.deepseek.com/v1
# AI_PRIMARY_MODEL=deepseek-chat

# OPÇÃO 3: Gemini gratuito
# AI_PRIMARY_PROVIDER=openai-compatible
# AI_PRIMARY_API_KEY=...
# AI_PRIMARY_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
# AI_PRIMARY_MODEL=gemini-1.5-flash
```

### 4. Iniciar Serviços

#### Terminal 1 - AI Gateway
```bash
wsl bash -lc "cd /mnt/c/Users/edenpc/Desktop/node ; npm run dev:gateway"
```
Aguarde: `[ai-gateway] listening on http://localhost:8787`

#### Terminal 2 - App Hub
```bash
wsl bash -lc "cd /mnt/c/Users/edenpc/Desktop/node ; npm run dev:hub"
```
Aguarde: `[app-hub] listening on http://localhost:8790`

---

## 🧪 Testar

### Opção 1: Dashboard Visual (Recomendado)
Abra no navegador:
```
file:///c:/Users/edenpc/Desktop/node/test-dashboard.html
```

Clique em "Testar" para cada app. Veja respostas em tempo real.

### Opção 2: API Manual

#### Healthchecks
```bash
curl http://localhost:8787/health
curl http://localhost:8790/health
```

#### Listar todos os apps
```bash
curl http://localhost:8790/apps | jq
```

#### Testar app específico

**Waitlist (CRUD):**
```bash
curl -X POST http://localhost:8790/apps/waitlist/run \
  -H "Content-Type: application/json" \
  -d '{"action":"subscribe","email":"user@example.com","name":"User"}'
```

**Job Board (CRUD):**
```bash
curl -X POST http://localhost:8790/apps/job-board/run \
  -H "Content-Type: application/json" \
  -d '{"action":"post","job":{"title":"Developer","company":"TechCo","location":"Remote"}}'
```

**Resume (AI):**
```bash
curl -X POST http://localhost:8790/apps/resume/run \
  -H "Content-Type: application/json" \
  -d '{"input":"Senior Full Stack Developer, 5 years Node.js/React, experience with microservices"}'
```

---

## 📊 Status dos Apps

| App               | Tipo       | Status | Features MVP                                    |
|-------------------|------------|--------|-------------------------------------------------|
| resume            | AI         | ✅     | Geração via IA, formato markdown                |
| esg               | AI         | ✅     | Métricas B2B, score de maturidade               |
| pitch-deck        | AI         | ✅     | 10 slides estruturados como markdown            |
| cold-email        | AI         | ✅     | Geração + deliverability checks (SPF/DMARC)     |
| screenshot-to-code| AI         | ✅     | HTML+React gerado, preview snippet              |
| brand-kit         | AI         | ✅     | Guia de marca completo, paleta de cores         |
| proposals         | AI         | ✅     | Proposta comercial PDF-ready                    |
| meeting-notes     | AI         | ✅     | 3 nichos (Sales/Legal/Medicina), action items   |
| changelog         | AI         | ✅     | Release notes categorizadas, persiste em memória|
| podcast           | AI         | ✅     | Show notes com timestamps, highlights           |
| social-proof      | AI         | ✅     | 5 variações de popup, embed snippet             |
| price-monitor     | AI         | ✅     | Salva snapshots, análise competitiva IA         |
| waitlist          | CRUD       | ✅     | Subscribe, referral code, leaderboard, position |
| job-board         | CRUD       | ✅     | Post job, list jobs, apply, get by ID           |
| client-portal     | CRUD       | ✅     | Projects, messages, status updates              |
| sub-box           | CRUD       | ✅     | Plans, subscribers, recurring billing logic     |
| notion-blog       | CRUD       | ✅     | Posts, slugs, tags, publish flag, metadata      |
| testimonials      | Hybrid     | ✅     | Submit, approve, wall generator, highlight IA   |
| analytics         | Hybrid     | ✅     | Track events, dashboard, insights IA            |
| uptime            | Hybrid     | ✅     | Monitors, checks real URLs, diagnose com IA     |

---

## 🧩 Shared Modules

### `memoryStore.js`
In-memory CRUD com namespaces:
```javascript
import memoryStore from '../shared/storage/memoryStore.js';

// Create
const user = memoryStore.create('users', { name: 'John', email: 'john@example.com' });

// Read
const john = memoryStore.get('users', user.id);

// List with filter
const activeUsers = memoryStore.list('users', (u) => u.status === 'active');

// Update
memoryStore.update('users', user.id, { status: 'active' });

// Delete
memoryStore.delete('users', user.id);
```

### `idGenerator.js`
```javascript
import { generateId, generateReferralCode } from '../shared/utils/idGenerator.js';

const userId = generateId('user'); // → user_a1b2c3d4
const code = generateReferralCode(); // → A1B2C3
```

### `embedRenderer.js`
```javascript
import { generateEmbedSnippet, generateWallHtml } from '../shared/utils/embedRenderer.js';

const snippet = generateEmbedSnippet({ appSlug: 'testimonials', targetId: 'widget' });
// → <script src="http://localhost:8790/embed.js" data-app="testimonials" data-target="widget"></script>

const wall = generateWallHtml(testimonials, { title: 'Wall of Love' });
// → HTML completo com grid de testimonials
```

---

## 🛠️ Desenvolvimento

### Adicionar novo app
1. Criar pasta `apps/<novo-slug>/`
2. Adicionar entrada em `apps/specs.json`
3. Criar handler em `services/app-hub/src/index.js`
4. Registrar no `runHandlers` object

### Estrutura de handler
```javascript
async function handleMyApp(appSpec, input) {
  // Parse input (pode ser string ou objeto)
  const data = typeof input === 'object' ? input : { input };
  
  // Lógica do app (AI, CRUD, ou híbrido)
  
  // Retornar formato padrão
  return {
    ok: true,
    status: 200,
    body: { ok: true, app: appSpec.slug, ...resultado }
  };
}
```

### Rodar app isolado
```javascript
import createApp from './shared/app-runner/createApp.js';
const server = createApp('my-app');
server.get('/', (req, res) => res.json({ hello: 'world' }));
const start = createApp.export(server, 3000);
start();
```

---

## 📦 MVP Features vs. Production

| Feature                 | MVP Status | Production Needs                  |
|-------------------------|------------|-----------------------------------|
| In-memory storage       | ✅         | PostgreSQL/Supabase              |
| Single-server           | ✅         | Load balancer + scaling          |
| No auth                 | ✅         | JWT auth + API keys              |
| AI via provider         | ✅         | Rate limiting + caching          |
| No billing              | ✅         | Stripe integration               |
| Basic error handling    | ✅         | Sentry + logging                 |
| HTTP only               | ✅         | HTTPS + CORS config              |

---

## 🤝 Arquivos Importantes

- `services/ai-gateway/src/index.js` - Proxy de IA com fallback
- `services/app-hub/src/index.js` - Hub com 20 handlers
- `apps/specs.json` - Especificações de todos os apps
- `shared/storage/memoryStore.js` - Persistência em memória
- `test-dashboard.html` - Dashboard visual de testes

---

## 📝 Notas Técnicas

- **Persistência**: Dados em memória são perdidos ao reiniciar (design MVP)
- **AI Gateway**: Suporta fallback automático entre providers
- **CORS**: Configurado para `*` no MVP (restringir em produção)
- **Portas**: 8787 (gateway), 8790 (hub)
- **Formato de resposta**: Sempre `{ ok, status, body }`

---

## 🚨 Troubleshooting

**Erro: EADDRINUSE**
```bash
# Matar processos nas portas
wsl bash -lc "pkill -9 -f 'node.*app-hub|npm.*hub'"
wsl bash -lc "pkill -9 -f 'node.*ai-gateway'"
```

**Erro: AI_API_KEY not configured**
- Apps com IA retornam 501 se gateway não tiver API key configurada
- Apps CRUD funcionam independentemente

**Porta 8790 não responde**
```bash
# Verificar processo
wsl bash -lc "ps aux | grep node | grep -E '8787|8790'"

# Netstat
wsl bash -lc "netstat -tlnp | grep -E '8787|8790'"
```

---

## 📈 Próximos Passos (Fora do Escopo MVP)

- [ ] Deploy em Fly.io/Railway
- [ ] Adicionar Supabase para persistência
- [ ] Implementar sistema de auth (Clerk/Auth0)
- [ ] Adicionar Stripe billing
- [ ] Frontend React para cada app
- [ ] Testes automatizados (Vitest)
- [ ] CI/CD com GitHub Actions
- [ ] Documentação OpenAPI/Swagger

---

**Versão**: 0.1.0 MVP  
**Data**: Fevereiro 2026  
**Stack**: Node.js 22, Express, OpenRouter/DeepSeek, In-Memory Storage