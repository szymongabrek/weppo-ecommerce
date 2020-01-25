const express = require('express');
const router = express.Router();
const User = require('../models/user');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const users = await User.findAll();
  res.json(users);
});

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body.user);
    res.json(user);
  } catch(e) {
    // find some better error code
    res.status(500).send('Internal Server Error');
  }
});

router.get('/{pk}', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.pk);
    res.json(user);
  } catch(e) {
    // implement better error handling?
    res.status(404).send('not found')
  }
});

module.exports = router;