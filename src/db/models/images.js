'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Images.belongsTo(models.Post, {
        foreignKey: {name: "postId", allowNull:false},
        as: "post",
       })
    }
  }
  Images.init({
     urlImg: { type: DataTypes.STRING,unique:true, allowNull:false, primaryKey: true},
     postId: {type: DataTypes.INTEGER, allowNull:false},
  }, {
    sequelize,
    modelName: 'Images',
    timestamps: false,
  });
  
  return Images;
};