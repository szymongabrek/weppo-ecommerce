const Sequelize = require('sequelize');
const sequelize = require('../database/config');
const Model = Sequelize.Model;

class Product extends Model {}
Product.init({
    // key: Sequelize.UUID,
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    price: Sequelize.NUMBER,
    category: Sequelize.STRING
}, { sequelize, modelName: 'product' });

module.exports = Product;