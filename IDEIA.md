# 💡 Ideia: Mega Repo — plataforma

> Este repositório é uma **ideia em validação**. Mapa completo de todas as ideias: [IDEIAS.md no repo `dev`](https://github.com/cantsixsix/dev/blob/claude/serene-bardeen-1tjfw2/IDEIAS.md).
>
> Estágios: 💡 ideia · 🧪 protótipo · 🚀 no ar · ✅ validada · 🗄️ arquivada.
> Regra: antes de escrever mais código, rodar o **teste** de uma variação. Sem reação em 2 semanas → 🗄️.

## X1 · Mega Repo — plataforma — `mega-repo` 🧪

O que sustenta todas as ideias. Cada parte pode virar produto:
- **X1.a AI Gateway** — `services/ai-gateway`: uma API única para qualquer provedor de IA (troca de modelo sem mexer no app).
- **X1.b App Hub** — `services/app-hub`: roda qualquer mini-app por rota.
- **X1.c Widget embed** — `shared/utils/embedRenderer.js`: qualquer mini-app vira um `<script>` para colar em outro site.
- **X1.d Gerador de documentos** — `shared/pdf/generateDocument.js`: base para propostas, relatórios, currículos.
- **X1.e Kit de MVP** — `createApp` + `memoryStore` + `idGenerator`: template para subir um micro-SaaS em 1 dia.

A vitrine que usa esta plataforma é a ideia **X2**, no repo `startup-portfolio-20apps`.

<!-- validacao:inicio -->

## 🧪 Como validar

Teste de 7 dias. Resultados vão na [Bancada de Ideias](https://claude.ai/artifact/Y4H9MCxyvwwLDmhL812znj).

### X1 · Mega Repo — plataforma

**Em uma frase:** A base técnica que deixa você lançar um micro-SaaS de IA em um dia.

- **Problema:** Cada ideia nova recomeça do zero: servidor, chamada de IA, banco, PDF.
- **Para quem:** Você mesmo primeiro; depois devs indie que querem lançar rápido.
- **Como funciona:** Uma central de IA que troca de provedor sem mexer no app, um hub que roda mini-apps e peças prontas (PDF, widget).
- **Como ganha dinheiro:** Uso interno; depois template pago (R$ 197) para outros devs.

| Teste | |
|---|---|
| Tipo | Colocar pessoas usando |
| Página | https://validar-ideias.netlify.app/x1/ |
| Onde divulgar | Usar para lançar as landings das ideias A1–A14; depois mostrar no Twitter/X |
| Preço testado | R$ 197 (template) |
| Meta em 7 dias | **Lançar 3 ideias com ela em 1 semana** |

<!-- validacao:fim -->
