const express = require('express');
const router = express.Router();
const db = require('../models/');


/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    let products = await db.Product.findAll();
    console.log(products.length);
    res.render('product/list', { title: 'Products', productlist: products});
  } catch(e) {
    console.error(e);
  }
});

router.get('/view', async (req, res, next) => {
  const product = await db.Product.findById(req.query.key);
  res.render('product/productview', {
      name: product ? product.name : "",
      productkey: req.query.key, product: product
  });
});

module.exports = router;