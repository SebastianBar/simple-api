import Sequelize, { Model } from "@sequelize/core";
import { sequelize } from "./index.js";

class MenuItem extends Model {}
MenuItem.init({
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  img: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, { sequelize })

export default MenuItem;
