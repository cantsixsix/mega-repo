export function basicDeliverabilityChecks(inputText) {
  const warnings = [];
  const lowered = String(inputText || "").toLowerCase();

  const spamSignals = ["100% grátis", "clique agora", "ganhe dinheiro rápido", "urgent", "free money"];
  for (const signal of spamSignals) {
    if (lowered.includes(signal)) {
      warnings.push(`Possível termo de spam detectado: ${signal}`);
    }
  }

  return {
    score: Math.max(0, 100 - warnings.length * 12),
    warnings,
    checklist: [
      "Validar SPF no domínio",
      "Validar DKIM no domínio",
      "Configurar DMARC com política inicial p=none",
      "Aquecer domínio gradualmente"
    ]
  };
}
