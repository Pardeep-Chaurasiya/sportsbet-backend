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
      SelectionId: { type: Sequelize.STRING },
      SelectionName: { type: Sequelize.STRING },
      MarketTypeId: { type: Sequelize.INTEGER },
      MarketName: { type: Sequelize.INTEGER },
      MatchId: { type: Sequelize.DECIMAL },
      MatchName: { type: Sequelize.DECIMAL },
      RegionId: { type: Sequelize.INTEGER },
      RegionName: { type: Sequelize.BOOLEAN },
      CompetitionId: { type: Sequelize.STRING },
      CompetitionName: { type: Sequelize.STRING },
      SportId: { type: Sequelize.INTEGER },
      SportName: { type: Sequelize.INTEGER },
      SportFullName: { type: Sequelize.DECIMAL },
      Price: { type: Sequelize.DECIMAL },
      IsLive: { type: Sequelize.INTEGER },
      Basis: { type: Sequelize.BOOLEAN },
      MatchInfo: { type: Sequelize.STRING },
      singleStake: { type: Sequelize.STRING },
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
