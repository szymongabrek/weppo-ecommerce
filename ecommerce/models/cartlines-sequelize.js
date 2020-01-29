// const fs = require('fs-extra');
// const util = require('util');
// const jsyaml = require('js-yaml');
const CartLine = require('./CartLine');
const products = require('./products-sequelize');
const Sequelize = require('sequelize');
const debug = require('debug')('cartlines:cartlines-sequelize');
const error = require('debug')('cartlines:error-sequelize');

let SQCartLine;
let sequlz;

async function connectDB() {
  if (typeof sequlz === 'undefined') {
    // const YAML = await fs.readFile(process.env.SEQUELIZE_CONNECT,'utf8');
    // const params = jsyaml.safeLoad(YAML, 'utf8'); 

    sequlz = new Sequelize('ecommerce', '', '', {
      dialect: 'sqlite',
      storage: 'db.sqlite3'
    });
  }
  if (SQCartLine) return SQCartLine.sync();
  SQCartLine = sequlz.define('Cartline', {
    cartkey: Sequelize.STRING,
    productkey: Sequelize.STRING,
    quantity: Sequelize.INTEGER
  });
  return SQCartLine.sync();
}

module.exports.create = async function create({
    cartkey,
    productkey,
    quantity
}) {
    const SQCartLine = await connectDB();
    const product = await products.read(productkey);
    const cartline = new CartLine(product, quantity);
    await SQCartLine.create({
        cartkey,
        productkey,
        quantity
    });
    return cartline;
}

module.exports.update = async function update({
    cartkey,
    productkey,
    quantity
}) {
    const SQCartLine = await connectDB();
    const cartline = await SQCartLine.findByPk(key);
    const product = await products.read(productkey);
    if (!cartline) {
        throw new Error(`No cartline found for ${key}`);
    } else if (!product) {
        throw new Error(`No product found for ${productkey}`);
    } else {
        await cartline.updateAttributes({
            cartkey,
            productkey,
            quantity
        });
        return new CartLine(product, quantity);
    }
}

module.exports.read = async function read(key) {
    const SQCartLine = await connectDB();
    const cartline = await SQCartLine.findByPk(key);
    const product = await products.read(cartline.productkey);
    if (!cartline) {
        throw new Error(`No cartline found for ${key}`);
    } else if (!product) {
        throw new Error(`No product found for ${cartline.productkey}`);
    } else {
        return new CartLine(product, cartline.quantity);
    }
}

module.exports.destroy = async function destroy(key) {
  const SQCartLine = await connectDB();
  const cartline = await SQCartLine.findByPk(key);
  return cartline.destroy();
}

module.exports.count = async function count() {
  const SQCartLine = await connectDB();
  const count = await SQCartLine.count();
  return count;
}

module.exports.close = async function close() {
  if (sequlz) sequlz.close();
  sequlz = undefined;
  SQCartLine = undefined;
}