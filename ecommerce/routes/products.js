const express = require('express');
const router = express.Router();
const products = require('../models/products-sequelize');

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

// temporary path for testing purposes
router.get('/create', async (req, res, next) => {
  const product = await products.create({ 
    key: '1',
    name: 'thing',
    description: 'desc',
    price: 13.0,
    category: 'cat'
  });
  res.send(product);
});

module.exports = router;