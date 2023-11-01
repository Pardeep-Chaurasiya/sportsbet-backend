"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserWallets", {
      walletAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      walletToken: { type: Sequelize.TEXT, allowNull: false },
      balance: { type: Sequelize.STRING, defaultValue: "0" },
      virtualBalance: { type: Sequelize.STRING, defaultValue: "100" },
      deposits: { type: Sequelize.JSON, defaultValue: null },
      claims: { type: Sequelize.JSON, defaultValue: null },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserWallets");
  },
};
