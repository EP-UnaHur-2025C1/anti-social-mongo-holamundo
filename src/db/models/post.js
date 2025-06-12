'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: {name: "nickName", allowNull:false},
        as: "usuario"
      })
      Post.hasMany(models.Comment, {
        foreignKey: { name: "postId", allowNull: false },
        as: "comments" // plural recomendado por convención
      });
      Post.hasMany(models.Images,{
        foreignKey: {name:"postId",allowNull: true},
        as: "images"
      })
      Post.belongsToMany(models.Tag,{
        through:models.PostTag,
        foreignKey: {name: "tagId", allowNull:false},
        as: "tag"
      })
    }
  }
  Post.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    nickName: { type: DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.STRING, allowNull: false },
    fecha: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: new Date()},
  }, {
    sequelize,
    modelName: 'Post',
    timestamps: false,
  });
  return Post;
};