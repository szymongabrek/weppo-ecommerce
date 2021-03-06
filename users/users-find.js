'use strict';

const util = require('util');
const restify = require('restify-clients');

const client = restify.createJsonClient({
  url: 'http://localhost:'+process.env.PORT,
  version: '*'
});

client.basicAuth('owca', 'T4KI3-H4X3R5KIE-H4SL0');

client.get('/find/'+ process.argv[2], 
(err, req, res, obj) => {
    if (err) console.error(err);
    else console.log('Found '+ util.inspect(obj));
});