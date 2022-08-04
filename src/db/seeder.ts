import { MenuItem } from "./sequelize.js";
import menuData from "./menuData.js";

export const seedMenuItems = async () => {
  await MenuItem.bulkCreate(menuData);
};
