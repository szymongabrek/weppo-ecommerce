const request = require('superagent');
const util = require('util');
const url = require('url');
const URL = url.URL;

const debug = require('debug')('notes:users-superagent');
const error = require('debug')('notes:error-superagent');

function reqURL(path) {
    const requrl = new URL(process.env.USER_SERVICE_URL);
    requrl.pathname = path;
    return requrl.toString();
}

module.exports.create = async function create(username, password,
    provider, familyName, givenName, middleName,
    emails, photos) {
    const res = await request
        .post(reqURL('/create-user'))
        .send({
            username,
            password,
            provider,
            familyName,
            givenName,
            middleName,
            emails,
            photos
        })
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth('owca', 'T4KI3-H4X3R5KIE-H4SL0');
    return res.body;
}

module.exports.update = async function update(username, password,
    provider, familyName, givenName, middleName,
    emails, photos) {
    const res = await request
        .post(reqURL(`/update-user/${username}`))
        .send({
            username,
            password,
            provider,
            familyName,
            givenName,
            middleName,
            emails,
            photos
        })
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth('owca', 'T4KI3-H4X3R5KIE-H4SL0');
    return res.body;
}

module.exports.find =  async function find(username) {
    const res = await request
        .get(reqURL(`/find/${username}`))
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth('owca', 'T4KI3-H4X3R5KIE-H4SL0');
    return res.body;
}

module.exports.userPasswordCheck = async function userPasswordCheck(username, password) { 
    const res = await request
        .post(reqURL(`/passwordCheck`))
        .send({ username, password })
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth('owca', 'T4KI3-H4X3R5KIE-H4SL0');
    return res.body;
} 

module.exports.findOrCreate = async function findOrCreate(profile) {  
    const res = await request
        .post(reqURL('/find-or-create'))
        .send({ 
            username: profile.id, password: profile.password, 
            provider: profile.provider, 
            familyName: profile.familyName, 
            givenName: profile.givenName, 
            middleName: profile.middleName, 
            emails: profile.emails, photos: profile.photos 
        })
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth('owca', 'T4KI3-H4X3R5KIE-H4SL0');
    return res.body;
}

module.exports.listUsers = async function listUsers() { 
    const res = await request
        .get(reqURL('/list'))
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth('owca', 'T4KI3-H4X3R5KIE-H4SL0');
    return res.body;
}