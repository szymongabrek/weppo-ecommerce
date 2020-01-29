const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const products = require('../models/products-sequelize');

let cart = new Cart([]);

router.get('/', (req, res) => {
    let lines = cart.cartLines;
    res.send(lines);
});

router.get('/add/:id', async (req, res) => {
    const product = await products.read(req.params.id);
    cart.addProduct(product, 1);
    res.redirect('/cart');
});

module.exports = router;