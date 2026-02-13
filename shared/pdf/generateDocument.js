export function renderPlainDocument({ title, sections = [] }) {
  const header = `# ${title}\n\n`;
  const body = sections
    .map((section) => `## ${section.heading}\n${section.content}\n`)
    .join("\n");

  return `${header}${body}`.trim();
}
