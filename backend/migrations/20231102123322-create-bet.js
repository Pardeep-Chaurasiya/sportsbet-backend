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
      walletAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "UserWallets",
          key: "walletAddress",
          as: "walletAddress",
        },
      },
      tournamentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Tournaments",
          key: "id",
          as: "tournamentId",
        },
      },
      command: { type: Sequelize.STRING },
      BetType: { type: Sequelize.INTEGER },
      AcceptMode: { type: Sequelize.INTEGER },
      Source: { type: Sequelize.INTEGER },
      TotalPrice: { type: Sequelize.DECIMAL },
      Amount: { type: Sequelize.DECIMAL },
      rid: { type: Sequelize.INTEGER },
      isLive: { type: Sequelize.BOOLEAN },
      status: { type: Sequelize.STRING, defaultValue: "Pending" },
      currency: { type: Sequelize.STRING, defaultValue: "$" },
      SelectionName: { type: Sequelize.STRING },
      MarketName: { type: Sequelize.STRING },
      MatchId: { type: Sequelize.STRING },
      FinalAmount: { type: Sequelize.DECIMAL, default: 0 },
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
