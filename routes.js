import menu from './menu.js';
import { Order } from './db/Order.js';

/**
 * @openapi
 * /menu:
 *   get:
 *     description: Returns the restaurant's menu.
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
export const getMenu = (_, res) => {
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
export const getOrders = async (_, res) => {
  const orders = await Order.findAll();

  res.json({ orders });
};



/**
 * @openapi
 * /orders:
 *   post:
 *     description: Creates a new order
 *     responses:
 *       200:
 *         description: An order has been created.
 */
export const postOrder = async (req, res) => {
  const payload = req.body;
  try {
    const order = await Order.create({
      ...payload,
      status: 'pending'
    });

    res.json({ order });
  } catch (err) {
    res.status(500).json({ err });
  }
};
