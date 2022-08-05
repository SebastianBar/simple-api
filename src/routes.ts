import type { Express, Request, Response } from 'express';
import { prisma } from './db/prisma.js';
import { compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * @openapi
 * /login:
 *   post:
 *     description: Authenticates a user.
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *         properties:
 *          email:
 *           type: string
 *           description: The user's email
 *           example: ali@berhayat.com
 *          password:
 *           type: string
 *           description: The user's password
 *           example: My$up3rP@ssw0rd
 *         required:
 *         - email
 *         - password
 *     responses:
 *       200:
 *         description: A JSON Web Token (JWT) is returned.
 *       401:
 *         description: Either the email or password is incorrect.
 */
const postLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    res.status(401).json({ token: null, message: 'Invalid email or password' });
    return;
  }
  const isValid = await compare(password, user.password);
  if (!isValid) {
    res.status(401).json({ token: null, message: 'Invalid email or password' });
    return;
  }
  const token = await jwt.sign({ id: user.id }, process.env.SIGNATURE_KEY || '123', { expiresIn: '1d' });
  res.json({ token, message: null });
}

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
  express.post('/login', postLogin);
  express.get('/menu', getMenu);
  express.get('/orders', getOrders);
  express.post('/orders', postOrder);
}
