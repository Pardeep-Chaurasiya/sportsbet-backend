"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserProfile.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  UserProfile.init(
    {
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      address: { type: DataTypes.STRING, allowNull: false },
      gender: { type: DataTypes.STRING, allowNull: false },
      idnumber: { type: DataTypes.STRING, allowNull: false },
      dob: { type: DataTypes.STRING, allowNull: false },
      nickname: { type: DataTypes.STRING, allowNull: false, unique: true },
      document_type: { type: DataTypes.STRING, allowNull: false },
      mobilenumber: { type: DataTypes.STRING, allowNull: false, unique: true },
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserProfile",
    }
  );
  return UserProfile;
};
