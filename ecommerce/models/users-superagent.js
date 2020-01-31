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