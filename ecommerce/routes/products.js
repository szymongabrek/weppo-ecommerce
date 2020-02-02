const express = require('express');
const router = express.Router();
const products = require('../models/products-sequelize');
const faker = require('faker');
const { ensureAuthenticated } = require('./users'); 

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    let keylist = await products.keylist();
    let keyPromises = keylist.map(key => {
      return products.read(key)
    });
    let productlist = await Promise.all(keyPromises);
    
    res.render('product/list', { 
      title: 'Products', 
      productlist: productlist,
      cart: req.session.cart,
      user: req.user ? req.user : undefined
    });
  } catch (e) { next(e); }
});

router.get('/view/:key', async (req, res, next) => {
  const product = await products.read(req.params.key);
  res.render('product/view', {
      name: product ? product.name : "",
      productkey: req.params.key,
      user: req.user ? req.user : undefined, 
      product: product,
      cart: req.session.cart
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

router.get('/add', ensureAuthenticated, (req, res, next) => {
  try {
      res.render('product/edit', {
          title: "Add a Product",
          docreate: true, productkey: "",
          user: req.user, product: undefined,
          cart: req.session.cart
      });
  } catch (e) { next(e); }
});

router.get('/edit/:key', ensureAuthenticated, async (req, res, next) => { 
  try {
      const product = await products.read(req.params.key);
      res.render('product/edit', {
          title: product ? ("Edit " + product.name) : "Add Product",
          docreate: false,
          productkey: req.params.key,
          user: req.user ? req.user : undefined, 
          product: product,
          cart: req.session.cart
      });
  } catch (e) { next(e); }
}); 

router.get('/destroy/:key', ensureAuthenticated, async (req, res, next) => { 
  try {
      const note = await products.read(req.param.key);
      res.render('product/destroy', {
          name: product ? `Delete ${product.name}` : "",
          productkey: req.params.key,
          user: req.user ? req.user : undefined, 
          product: product,
          cart: req.session.cart
      });
  } catch (e) { next(e); }
}); 

router.post('/destroy/confirm', ensureAuthenticated, (req, res, next) => { 
  // TODO: Delete confirmation route
}); 

router.get('/search/:term', async (req, res) => {
  try {
   
    const productlist = await products.search(req.params.term);
    
    res.render('product/list', { 
      title: 'Products', 
      productlist: productlist,
      cart: req.session.cart,
      user: req.user ? req.user : undefined
    });
  } catch (e) { next(e); }
});


module.exports = router;