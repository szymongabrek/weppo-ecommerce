const Cart = require('../models/Cart');

// very unique ID generator
function createUniqueID() {
  return 1;
}

exports.cartAttach = (req, res, next) => {
  if (!req.session.cart) {
    const cartlines = [];
    const userkey = createUniqueID();
    const newCart = new Cart(cartlines, userkey);
    req.session.cart = {
      lines: newCart.cartLines,
      userkey: newCart.userkey
    }
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
    lines: cart.cartLines,
    userkey: cart.userkey
  }
}