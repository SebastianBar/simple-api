import type { Express, Request, Response } from 'express';
import { Order, MenuItem } from './db/sequelize.js';

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
  const menu = await MenuItem.findAll();
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
  const orders = await Order.findAll();

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
 *             id:
 *              type: string
 *              description: One of the menu items' id
 *             quantity:
 *              type: integer
 *              description: The quantity of the item
 *         required:
 *         - table
 *         - customer
 *         - items
 *     responses:
 *       201:
 *         description: An order has been created.
 *       500:
 *         description: Something catastrophic has happened.
 */
const postOrder = async (req: Request, res: Response) => {
  const payload = req.body;
  try {
    const order = await Order.create({
      ...payload,
      status: 'pending'
    });

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ err });
  }
};

export const wrapRoutes = (express: Express) => {
  express.get('/menu', getMenu);
  express.get('/orders', getOrders);
  express.post('/orders', postOrder);
}
