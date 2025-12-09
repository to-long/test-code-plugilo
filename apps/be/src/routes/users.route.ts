import { Hono } from 'hono';

const app = new Hono();

// In-memory users store
const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
];

/**
 * @api {get} /api/users Get all users
 * @apiGroup Users
 */
app.get('/api/users', (c) => c.json(users));

/**
 * @api {get} /api/users/:id Get user by ID
 * @apiGroup Users
 */
app.get('/api/users/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const user = users.find((u) => u.id === id);
  if (!user) return c.json({ error: 'User not found' }, 404);
  return c.json(user);
});

/**
 * @api {post} /api/users Create user
 * @apiGroup Users
 */
app.post('/api/users', async (c) => {
  const body = await c.req.json();
  const newUser = {
    id: Math.max(...users.map((u) => u.id), 0) + 1,
    name: body.name,
    email: body.email,
  };
  users.push(newUser);
  return c.json(newUser, 201);
});

/**
 * @api {put} /api/users/:id Update user
 * @apiGroup Users
 */
app.put('/api/users/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return c.json({ error: 'User not found' }, 404);
  users[index] = { ...users[index], ...body };
  return c.json(users[index]);
});

/**
 * @api {delete} /api/users/:id Delete user
 * @apiGroup Users
 */
app.delete('/api/users/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return c.json({ error: 'User not found' }, 404);
  users.splice(index, 1);
  return c.json({ message: 'User deleted successfully' });
});

export { app as usersRoutes };
