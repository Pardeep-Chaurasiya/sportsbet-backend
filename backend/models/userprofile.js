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
      address: { type: DataTypes.STRING, allowNull: true },
      gender: { type: DataTypes.STRING, allowNull: true },
      idnumber: { type: DataTypes.STRING, allowNull: true },
      dob: { type: DataTypes.STRING, allowNull: true },
      nickname: { type: DataTypes.STRING, allowNull: true, unique: true },
      document_type: { type: DataTypes.STRING, allowNull: true },
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserProfile",
    }
  );
  return UserProfile;
};
