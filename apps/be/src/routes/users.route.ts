import { Hono } from 'hono';

const app = new Hono();

const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Charlie Brown', email: 'charlie@example.com' },
];

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
app.get('/api/users', (c) => c.json(users));

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: Not found
 */
app.get('/api/users/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const user = users.find((u) => u.id === id);
  if (!user) return c.json({ error: 'User not found' }, 404);
  return c.json(user);
});

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Create user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
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
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
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
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 */
app.delete('/api/users/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return c.json({ error: 'User not found' }, 404);
  users.splice(index, 1);
  return c.json({ message: 'User deleted successfully' });
});

export { app as usersRoutes };
