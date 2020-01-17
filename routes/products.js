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
  
  res.render('product/list', { title: 'Products', productlist: productlist });
});

router.get('/view', async (req, res, next) => {
  const product = await products.read(req.query.key);
  res.render('product/productview', {
      name: product ? product.name : "",
      productkey: req.query.key, product: product
  });
});

module.exports = router;