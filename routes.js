import menu from './menu.js';

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
