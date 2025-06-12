module.exports = (sequelize, DataTypes) =>{
  const PostTag = sequelize.define(
    "PostTag",
    {
      //No necesitas campos aqui a menos que quieras atributos adicionales
    },
    {
      timestamps:false, //Esto si funciona en modelos explicitos.
      tableName:"PostTag",
    }
  );

  return PostTag
}