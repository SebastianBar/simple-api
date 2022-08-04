import { Sequelize, DataTypes } from '@sequelize/core';

export const sequelize = new Sequelize('sqlite::memory:', { logging: false });

export const MenuItem = sequelize.define('MenuItem', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  img: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export const Order = sequelize.define('Order', {
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
})
