# Startup Portfolio (20 Apps) - Scaffold

Estrutura inicial criada com:
- `apps/` contendo 20 apps (1 pasta por ideia)
- `services/ai-gateway/` com API aberta provider-agnostic
- `services/app-hub/` com execução unificada dos 20 apps por rota
- arquivos `.env.example` no root, gateway e cada app

## API aberta (separada)

Endpoint principal:
- `POST http://localhost:8787/api/ai`

Healthcheck:
- `GET http://localhost:8787/health`

### Rodar gateway

1. Instale dependências do gateway:
   - `npm install --workspace services/ai-gateway`
2. Copie `services/ai-gateway/.env.example` para `.env` e preencha (ou deixe vazio por enquanto)
3. Execute:
   - `npm run dev:gateway`

Se `AI_API_KEY` estiver vazio, o gateway responde `501` com `AI_API_KEY not configured`.

## App Hub (20 apps em execução única)

Endpoint principal:
- `GET http://localhost:8790/apps`

Detalhe de um app:
- `GET http://localhost:8790/apps/:slug`

Executar app:
- `POST http://localhost:8790/apps/:slug/run`

### Rodar app-hub

1. Instale dependências do hub:
   - `npm install --workspace services/app-hub`
2. Copie `services/app-hub/.env.example` para `.env`
3. Execute:
   - `npm run dev:hub`

### Rodar tudo

- Terminal 1: `npm run dev:gateway`
- Terminal 2: `npm run dev:hub`

## Apps

Lista dos 20 apps scaffolded:
- `apps/registry.json`

Cada app tem seu arquivo de ambiente em:
- `apps/<app>/.env.example`

Elaboração funcional dos 20 apps:
- `apps/specs.json`
