const fs = require('fs-extra');
const util = require('util');
const jsyaml = require('js-yaml');
const Product = require('./Product');
const Sequelize = require('sequelize');
const debug = require('debug')('products:products-sequelize'); 
const error = require('debug')('products:error-sequelize'); 

let SQProduct; 
let sequlz;

async function connectDB() { 
  if (typeof sequlz === 'undefined') {
    const YAML = await fs.readFile(process.env.SEQUELIZE_CONNECT,'utf8');
    const params = jsyaml.safeLoad(YAML, 'utf8'); 
    sequlz = new Sequelize(params.dbname, params.username,
                           params.password, params.params); 
  }
  if (SQProduct) return SQProduct.sync(); 
  SQProduct = sequlz.define('Product', { 
        productkey: { type: Sequelize.STRING, primaryKey: true, unique: 
        true }, 
        name: Sequelize.STRING, 
        description: Sequelize.TEXT ,
        price: Sequelize.DECIMAL(20,2) ,
        category: Sequelize.STRING
  }); 
  return SQProduct.sync();
}

module.exports.create =  async function create(key, title, body) { 
    const SQNote = await connectDB();
    const product = new Product(key, title, body); 
    await SQNote.create({ notekey: key, title: title, body: body });
    return note;
}