const Sequelize = require('sequelize');
const sequelize = require('../database/config');
const Model = Sequelize.Model;
const bcrypt = require('bcrypt-nodejs');

class User extends Model {}
User.init({
    username: Sequelize.TEXT,
    password: Sequelize.TEXT,
    role: Sequelize.TEXT
}, { sequelize, modelName: 'user' });

// User.beforeCreate( (user, options) => {
//     return encryptPassword(user.password)
//     .then (success => {
//         user.password = success;
//     })
// });

User.beforeSave( (user, options) => {
    return encryptPassword(user.password)
    .then(success => {
        user.password = success
    })
    .catch(err => {
        console.error(err);
    });
});

function encryptPassword(password) {
    const saltRounds = 10;
    return new Promise( (resolve, reject) => {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) return reject(err);
            bcrypt.hash(password, salt, null, (err, hash) => {
                if (err) return reject(err);
                return resolve(hash);
            })
        })
    })
}

User.sync();

module.exports = User;