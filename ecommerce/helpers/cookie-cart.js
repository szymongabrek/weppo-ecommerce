const Cart = require('../models/Cart');

function generateKey() {
    return 1; // very unique key
}

function setKey(user) {
    return user ? user.key : generateKey();
}

exports.cartAttach = (req, res, next) => {
    if (!req.session.cart) {
        const cartlines = [];
        const userkey = setKey(req.user);
        const cart = new Cart(cartlines, userkey);
        req.session.cart = this.createCookieCartFromCart(cart);
    }
    next();
}

exports.createCartFromJSON = (jsonCart) => {
    const userkey = jsonCart.userkey;
    const cart = new Cart([], userkey);
    for (const product of jsonCart.lines) {
        cart.addProduct(product.product, product.quantity);
    }
    return cart;
}

exports.createCookieCartFromCart = (cart) => {
    return {
        userkey: cart.userkey,
        lines: cart.cartLines,
        totalQuantity: cart.productCount,
        totalValue: cart.total
    }
}