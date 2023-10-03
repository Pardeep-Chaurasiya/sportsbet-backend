
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
      address: { type: DataTypes.STRING },
      gender: { type: DataTypes.STRING },
      idnumber: { type: DataTypes.STRING },
      dob: { type: DataTypes.STRING },
      nickname: { type: DataTypes.STRING, unique: true },
      document_type: { type: DataTypes.STRING },
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserProfile",
    }
  );
  return UserProfile;
};

