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