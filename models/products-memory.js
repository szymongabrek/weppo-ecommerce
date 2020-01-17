const Product = require('./Product');

const products = [];

exports.update = exports.create = async function(key, name, description, price, category) {
    products[key] = new Product(key, name, description, price, category);
    return products[key];
};

exports.read = async function(key) {
    if (products[key]) return products[key];
    else throw new Error(`Product ${key} does not exist`);
};

exports.destroy = async function(key) {
    if (products[key]) {
        delete products[key];
    } else throw new Error(`Product ${key} does not exist`);
};

exports.keylist = async function() { return Object.keys(products); };
exports.count = async function() { return products.length; };
exports.close = async function() { }