import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

const Order = sequelize.define("Order", {
  // Model attributes are defined here
  table: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pending"
  }
});

export default Order;
