const Sequelize = require("sequelize");
const jsyaml = require('js-yaml');
const fs = require('fs-extra');
const log =  require('debug')('users:model-users');
const error = require('debug')('users:error'); 

let SQUser;
let sequlz;

async function connectDB() {
    
    if (SQUser) return SQUser.sync();
    // TODO: Environment variable
    const yamltext = await fs.readFile("./sequelize-sqlite.yml", 
    'utf8');

    const params = await jsyaml.safeLoad(yamltext, 'utf8');
    
    if (!sequlz) sequlz = new Sequelize(params.dbname, params.username,
                                        params.password, params.params);
    

    if (!SQUser) SQUser = sequlz.define('User', {
        username: { type: Sequelize.STRING, unique: true },
        password: Sequelize.STRING,
        provider: Sequelize.STRING,
        familyName: Sequelize.STRING,
        givenName: Sequelize.STRING,
        middleName: Sequelize.STRING,
        emails: Sequelize.STRING(2048),
        photos: Sequelize.STRING(2048),
        role : Sequelize.STRING
    });
    
    return SQUser.sync();
}

module.exports.create = async function create(username, password, provider, familyName, givenName, middleName, emails, photos, role) {
    const SQUser = await connectDB();
    return SQUser.create({
        username, password, provider,
        familyName, givenName, middleName,
        emails: JSON.stringify(emails), photos: JSON.stringify(photos), role: "ROLE_USER"
    });
}

module.exports.update = async function update(username, password, provider, familyName, givenName, middleName, emails, photos, role) {
    const user = await find(username);
    return user ? user.updateAttributes({
        password, provider,
        familyName, givenName, middleName,
        emails: JSON.stringify(emails),
        photos: JSON.stringify(photos),
        role: "ROLE_USER"
    }) : undefined;
}

module.exports.find = async function find(username) {
    const SQUser = await connectDB();
    const user = await SQUser.findOne({ where: { username: username } });
    const ret = user ? sanitizedUser(user) : undefined;
    return ret;
}

module.exports.destroy = async function destroy(username) {
    const SQUser = await connectDB();
    const user = await SQUser.findOne({ where: { username: username } });
    if (!user) throw new Error('Did not find requested '+ username +' to delete');
    user.destroy();
}

module.exports.userPasswordCheck = async function userPasswordCheck(username, password) {
    const SQUser = await connectDB();
    const user = await SQUser.findOne({ where: { username: username } });
    if (!user) {
        return { check: false, username: username, message: "Could not find user" };
    } else if (user.username === username && user.password === 
    password) {
        return { check: true, username: user.username };
    } else {
        return { check: false, username: username, message: "Incorrect password" };
    }
}

module.exports.findOrCreate = async function findOrCreate(profile) {
    const user = await find(profile.id);
    if (user) return user;
    return await create(profile.id, profile.password, profile.provider,
                    profile.familyName, profile.givenName, profile.middleName,
                    profile.emails, profile.photos, "ROLE_USER");
}

module.exports.listUsers = async function listUsers() {
    const SQUser = await connectDB();
    const userlist = await SQUser.findAll({});
    
    return userlist.map(user => sanitizedUser(user));
}

function sanitizedUser(user) {    
    const ret = {
        id: user.username, username: user.username,
        provider: user.provider,
        familyName: user.familyName,
        givenName: user.givenName,
        middleName: user.middleName,
        emails: JSON.parse(user.emails),
        photos: JSON.parse(user.photos),
        role: user.role 
    };
    try {
        ret.emails = JSON.parse(user.emails);
    } catch(e) { ret.emails = []; }
    try {
        ret.photos = JSON.parse(user.photos);
    } catch(e) { ret.photos = []; }
    return ret;
}