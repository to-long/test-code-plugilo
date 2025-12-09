import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { generalRoutes } from './routes/general.route.js';
import { usersRoutes } from './routes/users.route.js';
import { registerSwagger } from './open-api/index.js';

const app = new Hono();
const PORT = Number(process.env.PORT) || 8000;

app.use('*', cors());

// Routes
app.route('/', generalRoutes);
app.route('/', usersRoutes);

// Swagger
registerSwagger(app);

// 404
app.notFound((c) => c.json({ error: 'Not Found' }, 404));

console.log(`🚀 Server: http://localhost:${PORT}`);
console.log(`📚 Swagger: http://localhost:${PORT}/swagger`);

serve({ fetch: app.fetch, port: PORT });
