"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Tournaments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      SelectionId: { type: Sequelize.INTEGER },
      SelectionName: { type: Sequelize.STRING },
      MarketTypeId: { type: Sequelize.INTEGER },
      MarketName: { type: Sequelize.STRING },
      MatchId: { type: Sequelize.INTEGER },
      MatchName: { type: Sequelize.STRING },
      RegionId: { type: Sequelize.INTEGER },
      RegionName: { type: Sequelize.STRING },
      CompetitionId: { type: Sequelize.INTEGER },
      CompetitionName: { type: Sequelize.STRING },
      SportId: { type: Sequelize.INTEGER },
      SportName: { type: Sequelize.STRING },
      SportFullName: { type: Sequelize.STRING },
      Price: { type: Sequelize.DECIMAL },
      IsLive: { type: Sequelize.INTEGER },
      Basis: { type: Sequelize.INTEGER },
      MatchInfo: { type: Sequelize.STRING },
      singleStake: { type: Sequelize.INTEGER },
      MatchStartDate: { type: Sequelize.DATE },
      EventEndDate: { type: Sequelize.DATE },
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
    await queryInterface.dropTable("Tournaments");
  },
};
