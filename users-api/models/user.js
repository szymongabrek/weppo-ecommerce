const Sequelize = require('sequelize');
const sequelize = require('../database/config');
const Model = Sequelize.Model;
const { encryptPassword, verifyPassword } = require('../helpers/password');

class User extends Model {
    async encryptPassword() {
        try {
            const success = await encryptPassword(this.password);
            this.password = success;
        }
        catch (err) {
            console.error(err);
        }
    }

    async verifyPassword(password) {
        try {
            return await verifyPassword(password, this.password);
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