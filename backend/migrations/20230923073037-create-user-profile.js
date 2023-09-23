"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserProfiles", {
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
      firstName: { type: Sequelize.STRING, allowNull: false },
      lastName: { type: Sequelize.STRING },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      address: { type: Sequelize.STRING, allowNull: false },
      gender: { type: Sequelize.STRING, allowNull: false },
      dob: { type: Sequelize.STRING, allowNull: false },
      idnumber: { type: Sequelize.STRING, allowNull: false },
      nickname: { type: Sequelize.STRING, allowNull: false, unique: true },
      document_type: { type: Sequelize.STRING, allowNull: false },
      mobilenumber: { type: Sequelize.STRING, allowNull: false, unique: true },
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
    await queryInterface.dropTable("UserProfiles");
  },
};
