const Cart = require('../models/Cart');

exports.cartAttach = (req, res, next) => {
    if (!req.session.cart) {
        const cartlines = [];
        const userkey = req.user.key;
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