import type { Express, Request, Response } from 'express';
import { prisma } from './db/prisma.js';

/**
 * @openapi
 * /menu:
 *   get:
 *     description: Returns the restaurant's menu.
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
const getMenu = async (_: Request, res: Response) => {
  const menu = await prisma.menuItem.findMany();
  res.json({ menu });
};

/**
 * @openapi
 * /orders:
 *   get:
 *     description: List all orders
 *     responses:
 *       200:
 *         description: Returns an array of orders.
 */
const getOrders = async (_: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { status: 'pending' },
    include: {
      items: { select: { menuItemId: true, count: true } },
    }    
  });
  res.json({ orders });
};

/**
 * @openapi
 * /orders:
 *   post:
 *     description: Creates a new order
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *         properties:
 *          table:
 *           type: string
 *           description: The table number
 *          customer:
 *           type: string
 *           description: The customer's name
 *          items:
 *           type: array
 *           items:
 *            type: object
 *            properties:
 *             menuItemId:
 *              type: string
 *              description: One of the menu items' id
 *             count:
 *              type: integer
 *              description: The count for the specified item
 *              example: 2
 *         required:
 *         - table
 *         - customer
 *         - items
 *     responses:
 *       201:
 *         description: An order has been created.
 *       500:
 *         description: Something catastrophic has happened. Check if you're providing a proper menuItemId from /menu.
 */
const postOrder = async (req: Request, res: Response) => {
  const payload: { table: string, customer: string, items: { menuItemId: string, count: number }[] } = req.body;
  try {
    const order = await prisma.order.create({
      data: {
        table: payload.table,
        customer: payload.customer,
        items: {
          create: payload.items
        },
      },
    });

    res.status(201).json({ order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
};

export const wrapRoutes = (express: Express) => {
  express.get('/menu', getMenu);
  express.get('/orders', getOrders);
  express.post('/orders', postOrder);
}
