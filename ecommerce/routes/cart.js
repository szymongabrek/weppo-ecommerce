const express = require('express');
const router = express.Router();
const products = require('../models/products-sequelize');
const carts = require('../models/carts-sequelize');
const cartlines = require('../models/cartlines-sequelize');
const cartUtils = require('../helpers/cookie-cart');

router.get('/', (req, res) => {
    const cart = cartUtils.createCartFromJSON(req.session.cart);
    res.render('cart/view', { 
        title: 'Cart', 
        cart: {
            lines: cart.cartLines,
            totalQuantity: cart.productCount,
            totalValue: cart.total
        },
        user: req.user ? req.user : undefined
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

router.get('/checkout', async (req, res) => {
    const cart = cartUtils.createCartFromJSON(req.session.cart);
    res.render('cart/checkout', {
        title: 'Checkout', 
        cart: {
            lines: cart.cartLines,
            totalQuantity: cart.productCount,
            totalValue: cart.total
        },
        user: req.user ? req.user : undefined
    });
});

router.post('/checkout', async (req, res) => {
    try {
        // TODO: Save Order to Database
        // const name = req.body.firstName;
        // const lastName = req.body.lastName;
        // const company = req.body.company;
        // const email = req.body.email;
        // const phone = req.body.phone;
        // const address = req.body.address;
        // const country = req.body.country;
        // const appartment = req.body.appartment;
        // const city = req.body.city;
        // const district = req.body.district;
        // const post = req.body.post;
        // const shipFirst = req.body.shipName;
        // const shipLast = req.body.shipLast;
        // const shipCountry = req.body.shipCountry;
        // const shipEmail = req.body.shipEmail;
        // const shipPhone = req.body.shipPhone;
        // const shipAddress = req.body.shipAddress;
        // const shipCountry = req.body.shipCountry;
        // const shipAppartment = req.body.shipAppartment;
        // const shipCity = req.body.shipCity;
        // const shipDistrict = req.body.shipDistrict;
        // const shipPost = req.body.shipPost;
        // const shipNotes = req.body.shipNotes;
        // const paymentMethod = req.body.paymentMethods;
        // const cookiecCart = cartUtils.createCartFromJSON(req.session.cart);
        // const SQCart = {
        //     cart: {
        //         lines: cart.cartLines.map(cartline => {
        //             new cartlines.create({
        //                 cartKey:cookiecCart.getKey(),
        //                 productkey:cartline.name,
        //                 quantity: cartline.qunatity})}),
        //         totalQuantity: cart.productCount,
        //         totalValue: cart.total
        //     },
        //     user: req.user ? req.user : undefined
        // }

    } catch (e) { next(e); }
});

module.exports = router;