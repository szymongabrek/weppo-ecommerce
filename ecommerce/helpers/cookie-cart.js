const Cart = require('../models/Cart');

function generateKey() {
    return undefined; // very unique key
}

function getKey(user) {
    return user ? user.key : generateKey();
}

exports.attachCartToSession = (req, res, next) => {
    if (!req.session.cart) {
        const cartlines = [];
        const userkey = getKey(req.user);
        const cart = new Cart(cartlines, userkey);
        req.session.cart = this.createCookieCartFromCart(cart);
    }
    next();
}

exports.attachUserToCart = (cart, user) => {
    cart.userkey = user.username;
    return cart;
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