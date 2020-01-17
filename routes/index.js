const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
 
  res.render('index', { title: 'SimpleStore' });
});

module.exports = router;