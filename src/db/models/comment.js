'use strict';
const {
  Model,
  DATEONLY
} = require('sequelize');
const { toDefaultValue } = require('sequelize/lib/utils');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: {name: "nickName", allowNull:false},
        as: "usuario",
       })
      Comment.belongsTo(models.Post, {
        foreignKey: {name: "postId", allowNull:false},
        as: "post",
       })
    }
  }
  Comment.init({
    commentId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    postId: {type: DataTypes.INTEGER, allowNull: false},
    nickName: {type: DataTypes.STRING, allowNull: false},
    comentario: {type: DataTypes.STRING, allowNull: false},
    visible: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
    fecha: {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW}
  }, {
    sequelize,
    modelName: 'Comment',
    timestamps: false,
  });
  return Comment;
};