const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const products = require('../models/products-sequelize');

let cart = new Cart([]);

router.get('/', (req, res) => {
    let cartlines = cart.cartLines;
    res.render('cart/view', { title: 'Cart', cartlines });
});

router.get('/add/:id', async (req, res) => {
    const product = await products.read(req.params.id);
    cart.addProduct(product, 1);
    res.redirect('/products');
});

router.get('/remove/:id', async (req, res) => {
    cart.removeProduct(req.params.id);
    res.redirect('/cart');
})

module.exports = router;