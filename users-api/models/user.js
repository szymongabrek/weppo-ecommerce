const Sequelize = require('sequelize');
const sequelize = require('../database/config');
const Model = Sequelize.Model;
const passwordUtils = require('../helpers/password');

class User extends Model {
    async encryptPassword() {
        try {
            const success = await passwordUtils.encryptPassword(this.password);
            this.password = success;
        }
        catch (err) {
            console.error(err);
        }
    }

    verifyPassword(password) {
        try {
            return passwordUtils.verifyPassword(password, this.password);
        }
        catch (err) {
            console.error(err);
        }
    }
}
User.init({
    username: Sequelize.TEXT,
    password: Sequelize.TEXT,
    role: Sequelize.TEXT
}, { sequelize, modelName: 'user' });

User.beforeSave( async (user, options) => {
    await user.encryptPassword();
});

module.exports = User;