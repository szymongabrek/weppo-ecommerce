// const fs = require('fs-extra');
// const util = require('util');
// const jsyaml = require('js-yaml');
const Cart = require('./Cart');
const Sequelize = require('sequelize');
const debug = require('debug')('carts:carts-sequelize');
const error = require('debug')('carts:error-sequelize');

let SQCart;
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
  if (SQCart) return SQCart.sync();
  SQCart = sequlz.define('Cart', {
    cartkey: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true
    },
    userkey: Sequelize.String
  });
  return SQCart.sync();
}

module.exports.create = async function create({
  cartkey,
  userkey
}) {
  const SQCart = await connectDB();
  const cartlines = [];
  const cart = new Cart(cartlines, cartkey);
  await SQCart.create({
    cartkey,
    userkey
  });
  return cart;
}

module.exports.update = async function update({
  cartkey,
  userkey
}) {
  const SQCart = await connectDB();
  const cart = await SQCart.findByPk(key);
  const cartlines = [];
  if (!cart) {
    throw new Error(`No cart found for ${key}`);
  } else {
    await cart.updateAttributes({
      cartkey,
      userkey
    });
    return new Cart(cartlines, cartkey);
  }
}

module.exports.read = async function read(key) {
  const SQCart = await connectDB();
  const cart = await SQCart.findByPk(key);
  const cartlines = [];
  if (!cart) {
    throw new Error(`No cart found for ${key}`);
  } else {
    return new Cart(cartlines, key);
  }
}

module.exports.destroy = async function destroy(key) {
  const SQCart = await connectDB();
  const cart = await SQCart.findByPk(key);
  return cart.destroy();
}

module.exports.keylist = async function keylist() {
  const SQCart = await connectDB();
  const carts = await SQCart.findAll({
    attributes: ['cartkey']
  });
  return carts.map(cart => cart.cartkey);
}

module.exports.count = async function count() {
  const SQCart = await connectDB();
  const count = await SQCart.count();
  return count;
}

module.exports.close = async function close() {
  if (sequlz) sequlz.close();
  sequlz = undefined;
  SQCart = undefined;
}