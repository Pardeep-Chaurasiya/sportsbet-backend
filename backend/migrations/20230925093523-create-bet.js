"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bets", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
          as: "userId",
        },
      },
      command: { type: Sequelize.STRING },
      BetType: { type: Sequelize.STRING },
      AcceptMode: { type: Sequelize.INTEGER },
      Source: { type: Sequelize.INTEGER },
      TotalPrice: { type: Sequelize.DECIMAL },
      Amount: { type: Sequelize.DECIMAL },
      rid: { type: Sequelize.INTEGER },
      isLive: { type: Sequelize.BOOLEAN },
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
    await queryInterface.dropTable("Bets");
  },
};
