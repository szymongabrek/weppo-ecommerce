const express = require('express');
const router = express.Router();
const products = require('../models/products-sequelize');
const faker = require('faker');

/* GET home page. */
router.get('/', async (req, res, next) => {
  let keylist = await products.keylist();
  
  let keyPromises = keylist.map(key => {
    return products.read(key)
  });
  let productlist = await Promise.all(keyPromises);
  
  res.render('product/list', { title: 'Products', productlist: productlist });
});

router.get('/view', async (req, res, next) => {
  const product = await products.read(req.query.key);
  res.render('product/productview', {
      name: product ? product.name : "",
      productkey: req.query.key, product: product
  });
});

// temporary path for testing purposes // fake-[...] doesnt quite work hence why I use this
router.get('/create', async (req, res, next) => {
  let xs = [];
  for (let i = 0; i < 5; i++) {
    const key = faker.random.number().toString();
    const name = faker.commerce.productName();
    const price = faker.commerce.price();
    const description = faker.lorem.text();
    const category = faker.commerce.product();
    const product = await products.create({ key, name, price, description, category });
    xs.push(product);
  }
  res.send(xs);
});

module.exports = router;