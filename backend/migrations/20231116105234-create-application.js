"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Applications", {
      address: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "UserWallets",
          key: "walletAddress",
          as: "address",
        },
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      timestamp: {
        type: Sequelize.BIGINT,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Applications");
  },
};
