const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MY_DB,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: '127.0.0.1',
    port:"9906",
    dialect: 'mysql',
  },
);

module.exports = sequelize;
