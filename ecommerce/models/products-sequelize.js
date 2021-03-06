// const fs = require('fs-extra');
// const util = require('util');
// const jsyaml = require('js-yaml');
const Product = require('./Product');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const debug = require('debug')('products:products-sequelize');
const error = require('debug')('products:error-sequelize');

let SQProduct;
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
  if (SQProduct) return SQProduct.sync();
  SQProduct = sequlz.define('Product', {
    productkey: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true
    },
    name: Sequelize.STRING,
    description: Sequelize.TEXT,
    price: Sequelize.DECIMAL(20, 2),
    category: Sequelize.STRING
  });
  return SQProduct.sync();
}

module.exports.create = async function create({
  key,
  name,
  description,
  price,
  category
}) {
  const SQProduct = await connectDB();
  const product = new Product({
    key,
    name,
    description,
    price,
    category
  });
  await SQProduct.create({
    productkey: key,
    name,
    description,
    price,
    category
  });
  return product;
}

module.exports.update = async function update({
  key,
  name,
  description,
  price,
  category
}) {
  const SQProduct = await connectDB();
  const product = await SQProduct.findByPk(key);
  if (!product) {
    throw new Error(`No product found for ${key}`);
  } else {
    await product.updateAttributes({
      name,
      description,
      price,
      category
    });
    return new Product({
      key,
      name,
      description,
      price,
      category
    });
  }
}

module.exports.read = async function read(key) {
  const SQProduct = await connectDB();
  const product = await SQProduct.findByPk(key);
  if (!product) {
    throw new Error(`No product found for ${key}`);
  } else {
    return new Product({
      key: product.productkey,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category
    });
  }
}

module.exports.destroy = async function destroy(key) {
  const SQProduct = await connectDB();
  const product = await SQProduct.findOne({
    where: {
      productkey: key
    }
  })
  return await product.destroy();
}

module.exports.search = async function search(term) {
  
const SQProduct = await connectDB();
const products = await SQProduct.findAll({
  where: {
    name: {
      [Op.like]: '%' + term + '%'
    }
  }
});
debug(products);
if (!products) {
  throw new Error(`No search result for ${term}`);
} else {
  return products.map(product=>new Product({
    key: product.productkey,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category
  }))
}
}

module.exports.keylist = async function keylist() {
  const SQProduct = await connectDB();
  const products = await SQProduct.findAll({
    attributes: ['productkey']
  });
  return products.map(product => product.productkey);
}

module.exports.count = async function count() {
  const SQProduct = await connectDB();
  const count = await SQProduct.count();
  return count;
}

module.exports.close = async function close() {
  if (sequlz) sequlz.close();
  sequlz = undefined;
  SQProduct = undefined;
}

module.exports.categories = async function categories() {
  const SQProduct = await connectDB();
  // thing below returns a list of objects { DISTINCT: '<categoryName>' }
  const categories = await SQProduct.aggregate('category', 'DISTINCT', { plain: false });
  return categories.map(obj => obj.DISTINCT);
}

module.exports.findByCategory = async function findByCategory(category) {
  const SQProduct = await connectDB();
  const products = await SQProduct.findAll({
    where: {
      category: category
    }
  });
  return products.map(product=>new Product({
    key: product.productkey,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category
  }));
}