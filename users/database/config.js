const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'users.sqlite3',
  define: {
      timestamps: false
  },
});

module.exports = sequelize;