const express = require('express');
const router = express.Router();
const products = require('../models/products-sequelize');
const cartUtils = require('../helpers/cookie-cart');

router.get('/', (req, res) => {
    const cart = cartUtils.createCartFromJSON(req.session.cart);
    res.render('cart/view', { 
        title: 'Cart', 
        cart: {
            lines: cart.cartLines,
            totalQuantity: cart.productCount,
            totalValue: cart.total
        }
    });
});

// Looks like cookies do not support Map, hence why the weird session.cart assignment
router.get('/add/:id', async (req, res) => {
    const product = await products.read(req.params.id);
    const quantity = 1;
    const cart = cartUtils.createCartFromJSON(req.session.cart);
    cart.addProduct(product, quantity);
    req.session.cart = cartUtils.createCookieCartFromCart(cart);
    res.redirect('/products');
});

router.get('/remove/:id', async (req, res) => {
    const cart = cartUtils.createCartFromJSON(req.session.cart);
    cart.removeProduct(req.params.id);
    req.session.cart = cartUtils.createCookieCartFromCart(cart);
    res.redirect('/cart');
});

/**
 * Can't quite find a way to post maps in form...
 * <input name="quantities[{{key}}]"> yields literal 'quantities[123..]: 1'
 * instead of quantities { '123': 1 }, hence this retarded code.
 * If you find a correct solution, let me know.
 */
router.post('/update', async (req, res) => {
    const cart = cartUtils.createCartFromJSON(req.session.cart);
    for (const line of cart.cartLines) {
        const key = line.product.key;
        const quantity = Number(req.body[`quantities[${key}]`]);
        cart.changeQuantity(key, quantity);
    }
    req.session.cart = cartUtils.createCookieCartFromCart(cart);
    res.redirect('/cart');
});

module.exports = router;