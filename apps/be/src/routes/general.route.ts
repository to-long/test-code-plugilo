import { Hono } from 'hono';

const app = new Hono();

/**
 * @api {get} / Welcome
 * @apiGroup General
 */
app.get('/', (c) =>
  c.json({
    message: 'Welcome to the BE API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
);

/**
 * @api {get} /health Health check
 * @apiGroup General
 */
app.get('/health', (c) => c.json({ status: 'ok' }));

export { app as generalRoutes };
