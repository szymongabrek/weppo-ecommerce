const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'users.sqlite3',
  define: {
      timestamps: false
  },
});
const Model = Sequelize.Model;

class User extends Model {}
User.init({
    username: Sequelize.TEXT,
    password: Sequelize.TEXT,
    role: Sequelize.TEXT
}, { sequelize, modelName: 'user' });

module.exports = User;