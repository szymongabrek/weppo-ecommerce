const Cart = require('../models/Cart');

// very unique ID generator
function createUniqueID() {
  return 1;
}

exports.cartAttach = (req, res, next) => {
  if (!req.session.cartlines) {
    const cartlines = [];
    const userkey = createUniqueID();
    const newCart = new Cart(cartlines, userkey);
    req.session.cart.lines = newCart.cartLines;
    req.session.cart.userkey = newCart.userkey; 
  }
  console.log(req.session.cart);
  next();
}