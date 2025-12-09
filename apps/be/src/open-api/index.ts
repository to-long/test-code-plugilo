import type { Hono } from 'hono';
import { openApiSpec, generateSwaggerHtml } from './spec.js';

export function registerSwagger(app: Hono) {
  app.get('/swagger', (c) => c.html(generateSwaggerHtml('/swagger.json')));
  app.get('/swagger.json', (c) => c.json(openApiSpec));
}
