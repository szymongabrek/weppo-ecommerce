const Sequelize = require('sequelize');
const sequelize = require('../database/config');
const Model = Sequelize.Model;

class User extends Model {}
User.init({
    username: Sequelize.TEXT,
    password: Sequelize.TEXT,
    role: Sequelize.TEXT
}, { sequelize, modelName: 'user' });

module.exports = User;