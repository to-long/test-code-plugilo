import { readFileSync } from 'node:fs';
import type { Hono } from 'hono';

const swaggerHtml = `<!DOCTYPE html>
<html><head>
  <title>BE API</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head><body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>SwaggerUIBundle({ url: '/swagger.json', dom_id: '#swagger-ui' });</script>
</body></html>`;

export function registerSwagger(app: Hono) {
  app.get('/swagger', (c) => c.html(swaggerHtml));
  app.get('/swagger.json', (c) => {
    try {
      const spec = JSON.parse(readFileSync('./public/swagger.json', 'utf-8'));
      return c.json(spec);
    } catch {
      return c.json({ error: 'Run: bun run generate:swagger' }, 404);
    }
  });
}
