'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tweets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Tweets.init({
    text: DataTypes.TEXT,
    data: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Tweets',
  });
  return Tweets;
};