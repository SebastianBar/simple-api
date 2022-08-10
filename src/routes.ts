import type { Express, Request, Response } from 'express';
import pkg from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from './db/prisma.js';

const { compare, hash } = pkg;
const sign = (object: any) => jwt.sign(object, process.env.SIGNATURE_KEY || '123', { expiresIn: '1d' });

// eslint-disable-next-line no-unused-vars
const authMiddleware = (role?: string) => async (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).send({ message: 'No token provided' });
    return;
  }
  try {
    const user = jwt.verify(token, process.env.SIGNATURE_KEY || '123') as { id: string, role: string };
    if (role && user.role !== role) {
      res.status(401).send({ message: 'Your account is not allowed to access this resource' });
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Invalid token' });
  }
};

/**
 * @openapi
 * tags:
 *   - name: account
 *     description: Account related operations
 *   - name: restaurant
 *     description: Restaurant related operations
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *    type: http
 *    scheme: bearer
 *    bearerFormat: JWT
 */

/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *      - account
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
  const isValid = await compare(password, user.passwordHash);
  if (!isValid) {
    res.status(401).json({ token: null, message: 'Invalid email or password' });
    return;
  }
  const token = await sign({ id: user.id, role: user.role });
  res.json({ token, message: null });
};

/**
 * @openapi
 * /register:
 *   post:
 *     tags:
 *      - account
 *     description: Registers a new user.
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *         properties:
 *          name:
 *           type: string
 *           description: The user's name
 *           example: Ali Befa
 *          email:
 *           type: string
 *           description: The user's email
 *           example: ali@berhayat.com
 *          password:
 *           type: string
 *           description: The user's password
 *           example: My$up3rP@ssw0rd
 *          role:
 *           type: string
 *           description: The user's role (waiter or chef)
 *           example: waiter
 *         required:
 *         - name
 *         - email
 *         - password
 *         - role
 *     responses:
 *       200:
 *         description: A JSON Web Token (JWT) is returned.
 *       400:
 *         description: Invalid payload values provided. Check the documentation for the payload schema.
 *       401:
 *         description: Email already exists. Please choose another email.
 */
const postRegister = async (req: Request, res: Response) => {
  const {
    name, email, password, role,
  } = req.body;

  if (!['waiter', 'chef'].includes(role)) {
    res.status(400).json({ message: "Invalid role. Allowed roles are 'waiter' and 'chef'" });
    return;
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (user) {
    res.status(401).json({ token: null, message: 'Email already exists' });
    return;
  }

  const passwordHash = await hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
    },
  });

  const token = await sign({ id: newUser.id, role });
  res.json({ token, message: null });
};

/**
 * @openapi
 * /menu:
 *   get:
 *     tags:
 *      - restaurant
 *     description: Returns the restaurant's menu.
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 *     security:
 *         - bearerAuth: []
 */
const getMenu = async (_: Request, res: Response) => {
  const menu = await prisma.menuItem.findMany();
  res.json({ menu });
};

/**
 * @openapi
 * /orders:
 *   get:
 *     tags:
 *      - restaurant
 *     description: List all orders
 *     parameters:
 *        - name: status
 *          in: query
 *          description: Status values that need to be considered for filter
 *          required: false
 *          explode: true
 *          schema:
 *            type: string
 *            default: pending
 *            enum:
 *              - pending
 *              - completed
 *        - name: includeItems
 *          in: query
 *          description: If the return value should include the items' details
 *          required: false
 *          explode: false
 *          schema:
 *            type: boolean
 *            default: false
 *     responses:
 *       200:
 *         description: Returns an array of orders.
 *     security:
 *         - bearerAuth: []
 */
const getOrders = async (req: Request, res: Response) => {
  const { status, includeItems } = req.query;

  const orders = await prisma.order.findMany({
    where: { status: status as string || 'pending' },
    include: {
      items: { select: { menuItemId: true, count: true, menuItem: !!includeItems && includeItems === 'true' } },
    },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ orders });
};

/**
 * @openapi
 * /orders:
 *   post:
 *     tags:
 *      - restaurant
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
 *     security:
 *         - bearerAuth: []
 */
const postOrder = async (req: Request, res: Response) => {
  const payload: { table: string, customer: string, items: { menuItemId: string, count: number }[] } = req.body;
  try {
    const order = await prisma.order.create({
      data: {
        table: payload.table,
        customer: payload.customer,
        items: {
          create: payload.items,
        },
      },
    });

    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ err });
  }
};

/**
 * @openapi
 * /orders/{id}:
 *   put:
 *     tags:
 *      - restaurant
 *     description: Updates an existing order
 *     parameters:
 *        - name: id
 *          in: path
 *          description: The id of the order to be updated
 *          required: true
 *          explode: false
 *          schema:
 *            type: number
 *            default: 1
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *         properties:
 *          status:
 *           type: string
 *           description: The new status for the order
 *           example: completed
 *         required:
 *         - status
 *     responses:
 *       200:
 *         description: An order has been updated.
 *     security:
 *         - bearerAuth: []
 */
const putOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'completed'].includes(status)) {
    res.status(400).json({ message: "Invalid status. Allowed statuses are 'pending' and 'completed'" });
    return;
  }

  try {
    const order = await prisma.order.update({
      where: { id: Number.parseInt(id, 10) },
      data: { status },
    });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default (express: Express) => {
  express.post('/login', postLogin);
  express.post('/register', postRegister);
  express.get('/menu', getMenu);
  express.get('/orders', getOrders);
  express.post('/orders', postOrder);
  express.put('/orders/:id', putOrder);
};
