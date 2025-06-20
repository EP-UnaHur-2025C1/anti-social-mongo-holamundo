'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: {name: "nickName", allowNull:false},
        as: "posts",
      })
      User.hasMany(models.Comment, {
        foreignKey: {name: "nickName", allowNull:false},
        as: "comments",
      })
      User.belongsToMany(models.User,{
        through:models.Follow,
        foreignKey: {name: "seguidorId", allowNull:false},
        otherKey: "seguidoId",
        as: "seguidores",
      })
      User.belongsToMany(models.User,{
      through: models.Follow,
      foreignKey: {name: "seguidoId", allowNull:false},
      otherKey: "seguidorId",
      as: "seguidos",
      })
    }
  }
  User.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    nickName: { type: DataTypes.STRING, unique: true, allowNull: false},
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },

  }, {
    sequelize,
    modelName: 'User',
    timestamps: false,
  });
  return User;
};