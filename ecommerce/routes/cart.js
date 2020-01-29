const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const products = require('../models/products-sequelize');

router.get('/', (req, res) => {
    const userkey = req.session.cart.userkey;
    const cart = new Cart([], userkey);
    for (const product of req.session.cart.lines) {
        cart.addProduct(product.product, product.quantity);
    }
    res.render('cart/view', { title: 'Cart', cartlines: cart.cartLines, total: cart.total });
});

// Looks like cookies do not support Map, hence why the weird session.cart assignment
router.get('/add/:id', async (req, res) => {
    const product = await products.read(req.params.id);
    const quantity = 1;
    const newCart = new Cart(req.session.cart.lines, req.session.cart.userkey);
    newCart.addProduct(product, quantity);
    req.session.cart = {
        lines: newCart.cartLines,
        userkey: newCart.userkey
    }
    res.redirect('/products');
});

router.get('/remove/:id', async (req, res) => {
    const newCart = new Cart(req.session.cart.cartLines, req.session.cart.userkey);
    newCart.removeProduct(req.params.id);
    req.session.cart = newCart;
    res.redirect('/cart');
})

module.exports = router;