const express = require('express');
const router = express.Router();
// const products = require('../models/products-memory');
const products = require('../models/fake-products-factory')(10);

/* GET home page. */
router.get('/', async (req, res, next) => {
  let keylist = await products.keylist();
  let keyPromises = keylist.map(key => {
    return products.read(key)
  });
  let productlist = await Promise.all(keyPromises);
  
  res.render('list', { title: 'Products', productlist: productlist });
});

module.exports = router;