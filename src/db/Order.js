import Sequelize, { Model } from "@sequelize/core";
import { sequelize } from "./index.js";

class Order extends Model {}
Order.init({
  table: {
    type: Sequelize.STRING,
    allowNull: false
  },
  customer: {
    type: Sequelize.STRING,
    allowNull: false
  },
  items: {
    type: Sequelize.JSON,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "pending"
  }
}, { sequelize })

export default Order;
