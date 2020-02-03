const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensurePermissions } = require('./users'); 

router.get('/', ensureAuthenticated, ensurePermissions, async (req, res) => {
  //TODO: get all the orders
  res.render('orders/list', { 
    title: 'Orders', 
    cart: {
        lines: cart.cartLines,
        totalQuantity: cart.productCount,
        totalValue: cart.total
    },
    user: req.user ? req.user : undefined,
    orders: orders
  });
});

router.get('/view/:key', async (req, res, next) => {
  const order = await order.find(req.params.key);
  res.render('order/view', { 
      title: 'Order', 
      order: {
          lines: order.cartLines,
          totalQuantity: order.productCount,
          totalValue: order.total
      },
      user: req.user ? req.user : undefined
  });
});