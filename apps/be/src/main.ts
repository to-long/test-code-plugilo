import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { initDb } from '../db/index.js';
import { cardsRoutes } from './routes/cards.route.js';
import { generalRoutes } from './routes/general.route.js';
import { stacksRoutes } from './routes/stacks.route.js';
import { usersRoutes } from './routes/users.route.js';

const app = new Hono();
const PORT = Number(process.env.PORT) || 8000;

app.use('*', cors());

// Routes
app.route('/', generalRoutes);
app.route('/', stacksRoutes);
app.route('/', cardsRoutes);

// Serve static swagger files from public folder
app.use(
  '/swagger/*',
  serveStatic({ root: './public', rewriteRequestPath: (p) => p.replace('/swagger', '') }),
);
app.get('/swagger', (c) => c.redirect('/swagger/swagger.html'));

// 404
app.notFound((c) => c.json({ error: 'Not Found' }, 404));

// Initialize database and start server
async function start() {
  await initDb();
  console.log('📦 Database initialized');
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📚 Swagger: http://localhost:${PORT}/swagger`);
  serve({ fetch: app.fetch, port: PORT });
}

start().catch(console.error);
