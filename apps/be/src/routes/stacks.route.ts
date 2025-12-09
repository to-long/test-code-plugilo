import { Hono } from 'hono';
import { stackRepo } from '../data/stacks.store.js';

const app = new Hono();

/**
 * @openapi
 * /api/stacks:
 *   get:
 *     tags: [Stacks]
 *     summary: Get all stacks with card counts
 *     responses:
 *       200:
 *         description: List of stacks with card counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   cover:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [color, gradient, image]
 *                       value:
 *                         type: string
 *                   cardCount:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 */
app.get('/api/stacks', (c) => {
  const stacks = stackRepo.findAll().map((s) => ({
    id: s.id,
    name: s.name,
    cover: { type: s.cover_type, value: s.cover_value },
    cardCount: s.cardCount,
    createdAt: s.created_at,
  }));
  return c.json(stacks);
});

/**
 * @openapi
 * /api/stacks/{id}:
 *   get:
 *     tags: [Stacks]
 *     summary: Get stack by ID with its cards
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stack with cards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 cover:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [color, gradient, image]
 *                     value:
 *                       type: string
 *                 cards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       stackId:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       cover:
 *                         type: string
 *                       description:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Stack not found
 */
app.get('/api/stacks/:id', (c) => {
  const id = Number.parseInt(c.req.param('id'));
  const stack = stackRepo.findByIdWithCards(id);
  if (!stack) return c.json({ error: 'Stack not found' }, 404);

  return c.json({
    id: stack.id,
    name: stack.name,
    cover: { type: stack.cover_type, value: stack.cover_value },
    cards: stack.cards.map((card) => ({
      id: card.id,
      stackId: card.stack_id,
      name: card.name,
      cover: card.cover,
      description: card.description,
      createdAt: card.created_at,
    })),
    createdAt: stack.created_at,
  });
});

/**
 * @openapi
 * /api/stacks:
 *   post:
 *     tags: [Stacks]
 *     summary: Create a new stack
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               cover:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [color, gradient, image]
 *                   value:
 *                     type: string
 *     responses:
 *       201:
 *         description: Stack created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 cover:
 *                   type: object
 *                 createdAt:
 *                   type: string
 */
app.post('/api/stacks', async (c) => {
  const body = await c.req.json();
  const stack = stackRepo.create({ name: body.name, cover: body.cover });

  return c.json(
    {
      id: stack.id,
      name: stack.name,
      cover: { type: stack.cover_type, value: stack.cover_value },
      createdAt: stack.created_at,
    },
    201,
  );
});

/**
 * @openapi
 * /api/stacks/{id}:
 *   put:
 *     tags: [Stacks]
 *     summary: Update a stack
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               cover:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [color, gradient, image]
 *                   value:
 *                     type: string
 *     responses:
 *       200:
 *         description: Stack updated
 *       404:
 *         description: Stack not found
 */
app.put('/api/stacks/:id', async (c) => {
  const id = Number.parseInt(c.req.param('id'));
  const body = await c.req.json();

  const stack = stackRepo.update(id, { name: body.name, cover: body.cover });
  if (!stack) return c.json({ error: 'Stack not found' }, 404);

  return c.json({
    id: stack.id,
    name: stack.name,
    cover: { type: stack.cover_type, value: stack.cover_value },
    createdAt: stack.created_at,
  });
});

/**
 * @openapi
 * /api/stacks/{id}:
 *   delete:
 *     tags: [Stacks]
 *     summary: Delete a stack and all its cards
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stack deleted
 *       404:
 *         description: Stack not found
 */
app.delete('/api/stacks/:id', (c) => {
  const id = Number.parseInt(c.req.param('id'));
  const deleted = stackRepo.delete(id);
  if (!deleted) return c.json({ error: 'Stack not found' }, 404);

  return c.json({ message: 'Stack deleted successfully' });
});

export { app as stacksRoutes };
