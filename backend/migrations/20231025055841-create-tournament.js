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
      SelectionId: { type: Sequelize.BIGINT },
      SelectionName: { type: Sequelize.STRING },
      MarketTypeId: { type: Sequelize.BIGINT },
      MarketName: { type: Sequelize.STRING },
      MatchId: { type: Sequelize.BIGINT },
      MatchName: { type: Sequelize.STRING },
      RegionId: { type: Sequelize.BIGINT },
      RegionName: { type: Sequelize.STRING },
      CompetitionId: { type: Sequelize.BIGINT },
      CompetitionName: { type: Sequelize.STRING },
      SportId: { type: Sequelize.BIGINT },
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
