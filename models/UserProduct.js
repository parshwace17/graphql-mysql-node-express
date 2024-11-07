// models/UserProduct.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');

const UserProduct = sequelize.define('UserProduct', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: Product,
      key: 'id',
    },
  },
});

User.belongsToMany(Product, { through: UserProduct });
Product.belongsToMany(User, { through: UserProduct });

module.exports = UserProduct;
