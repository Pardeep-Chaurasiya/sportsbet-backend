"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn("Tournaments", "SelectionId", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.changeColumn("Tournaments", "MarketTypeId", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.changeColumn("Tournaments", "MatchId", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.changeColumn("Tournaments", "RegionId", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.changeColumn("Tournaments", "CompetitionId", {
      type: Sequelize.BIGINT,
    });
    await queryInterface.changeColumn("Tournaments", "SportId", {
      type: Sequelize.BIGINT,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
