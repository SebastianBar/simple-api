import menu from './menu.js';

export const getRoot = (_, res) => {
  res.json({ message: "Hi, I'm a shitty API!" });
};

export const getMenu = (_, res) => {
  res.json({ menu });
};
