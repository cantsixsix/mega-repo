export function generateEmbedSnippet({ appSlug, targetId, hubUrl = "http://localhost:8790" }) {
  const scriptUrl = `${hubUrl}/embed/${appSlug}.js`;
  return `<div id="${targetId}"></div>\n<script src="${scriptUrl}" data-target="${targetId}"></script>`;
}

export function generateWallHtml(items, { title = "Wall of Love", theme = "light" } = {}) {
  const itemsHtml = items
    .map(
      (item) => `
    <div class="wall-item">
      <p class="wall-text">"${item.text}"</p>
      <div class="wall-author">
        <strong>${item.author}</strong>
        ${item.role ? `<span>${item.role}</span>` : ""}
      </div>
    </div>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: sans-serif; background: ${theme === "dark" ? "#111" : "#f9f9f9"}; color: ${theme === "dark" ? "#fff" : "#333"}; padding: 40px 20px; }
    h1 { text-align: center; margin-bottom: 40px; }
    .wall-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
    .wall-item { background: ${theme === "dark" ? "#222" : "#fff"}; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .wall-text { font-style: italic; margin-bottom: 16px; line-height: 1.6; }
    .wall-author { font-size: 14px; opacity: 0.8; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="wall-grid">${itemsHtml}</div>
</body>
</html>
  `.trim();
}
