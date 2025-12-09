import { Hono } from 'hono';
import { cardRepo, stackRepo } from '../data/store.js';

const app = new Hono();

// Helper to transform card from DB format to API format
const transformCard = (card: {
  id: number;
  stack_id: number;
  name: string;
  cover: string;
  description: string | null;
  created_at: string;
}) => ({
  id: card.id,
  stackId: card.stack_id,
  name: card.name,
  cover: card.cover,
  description: card.description,
  createdAt: card.created_at,
});

/**
 * @openapi
 * /api/cards:
 *   get:
 *     tags: [Cards]
 *     summary: Get all cards
 *     responses:
 *       200:
 *         description: List of all cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   stackId:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   cover:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 */
app.get('/api/cards', (c) => {
  const cards = cardRepo.findAll().map(transformCard);
  return c.json(cards);
});

/**
 * @openapi
 * /api/cards/{id}:
 *   get:
 *     tags: [Cards]
 *     summary: Get card by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Card found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 stackId:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 cover:
 *                   type: string
 *                 description:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Card not found
 */
app.get('/api/cards/:id', (c) => {
  const id = Number.parseInt(c.req.param('id'));
  const card = cardRepo.findById(id);
  if (!card) return c.json({ error: 'Card not found' }, 404);
  return c.json(transformCard(card));
});

/**
 * @openapi
 * /api/stacks/{stackId}/cards:
 *   get:
 *     tags: [Cards]
 *     summary: Get all cards in a stack
 *     parameters:
 *       - name: stackId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   stackId:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   cover:
 *                     type: string
 *                   description:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *       404:
 *         description: Stack not found
 */
app.get('/api/stacks/:stackId/cards', (c) => {
  const stackId = Number.parseInt(c.req.param('stackId'));
  const stack = stackRepo.findById(stackId);
  if (!stack) return c.json({ error: 'Stack not found' }, 404);

  const cards = cardRepo.findByStackId(stackId).map(transformCard);
  return c.json(cards);
});

/**
 * @openapi
 * /api/stacks/{stackId}/cards:
 *   post:
 *     tags: [Cards]
 *     summary: Create a card in a stack
 *     parameters:
 *       - name: stackId
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
 *             required:
 *               - name
 *               - cover
 *             properties:
 *               name:
 *                 type: string
 *               cover:
 *                 type: string
 *                 description: Image URL for the card cover
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Card created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 stackId:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 cover:
 *                   type: string
 *                 description:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Stack not found
 */
app.post('/api/stacks/:stackId/cards', async (c) => {
  const stackId = Number.parseInt(c.req.param('stackId'));
  const stack = stackRepo.findById(stackId);
  if (!stack) return c.json({ error: 'Stack not found' }, 404);

  const body = await c.req.json();
  const card = cardRepo.create({
    stackId,
    name: body.name,
    cover: body.cover,
    description: body.description,
  });

  return c.json(transformCard(card), 201);
});

/**
 * @openapi
 * /api/cards/{id}:
 *   put:
 *     tags: [Cards]
 *     summary: Update a card
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
 *                 type: string
 *               description:
 *                 type: string
 *               stackId:
 *                 type: integer
 *                 description: Move card to a different stack
 *     responses:
 *       200:
 *         description: Card updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 stackId:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 cover:
 *                   type: string
 *                 description:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Card not found
 */
app.put('/api/cards/:id', async (c) => {
  const id = Number.parseInt(c.req.param('id'));
  const body = await c.req.json();

  // If moving to a different stack, validate the target stack exists
  if (body.stackId !== undefined) {
    const targetStack = stackRepo.findById(body.stackId);
    if (!targetStack) return c.json({ error: 'Target stack not found' }, 404);
  }

  const card = cardRepo.update(id, {
    name: body.name,
    cover: body.cover,
    description: body.description,
    stackId: body.stackId,
  });

  if (!card) return c.json({ error: 'Card not found' }, 404);
  return c.json(transformCard(card));
});

/**
 * @openapi
 * /api/cards/{id}:
 *   delete:
 *     tags: [Cards]
 *     summary: Delete a card
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Card deleted
 *       404:
 *         description: Card not found
 */
app.delete('/api/cards/:id', (c) => {
  const id = Number.parseInt(c.req.param('id'));
  const deleted = cardRepo.delete(id);
  if (!deleted) return c.json({ error: 'Card not found' }, 404);

  return c.json({ message: 'Card deleted successfully' });
});

/**
 * @openapi
 * /api/cards/{id}/move:
 *   patch:
 *     tags: [Cards]
 *     summary: Move a card to a different stack
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
 *             required:
 *               - stackId
 *             properties:
 *               stackId:
 *                 type: integer
 *                 description: Target stack ID
 *     responses:
 *       200:
 *         description: Card moved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 stackId:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 cover:
 *                   type: string
 *                 description:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Card or stack not found
 */
app.patch('/api/cards/:id/move', async (c) => {
  const id = Number.parseInt(c.req.param('id'));
  const body = await c.req.json();

  const targetStack = stackRepo.findById(body.stackId);
  if (!targetStack) return c.json({ error: 'Target stack not found' }, 404);

  const card = cardRepo.move(id, body.stackId);
  if (!card) return c.json({ error: 'Card not found' }, 404);

  return c.json(transformCard(card));
});

export { app as cardsRoutes };
