import { Sequelize } from '@sequelize/core';

export const sequelize = new Sequelize('sqlite::memory:');
