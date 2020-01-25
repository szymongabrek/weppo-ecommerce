const express = require('express');
const router = express.Router();
const User = require('../models/user');

function sendError(res, err, backupCode) {
  res.status(err.status || backupCode).json({
    message: err.message,
    error: err
  });
}

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const users = await User.findAll();
  res.json(users);
});

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body.user);
    res.json(user);
  } catch(err) {
    // find some better error code
    sendError(res, err, 500);
  }
});

router.get('/:pk', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.pk);
    res.json(user);
  } catch(e) {
    sendError(res, err, 404);
  }
});

router.put('/:pk', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.pk);
    for (const key in req.body.user) {
      user[key] = req.body.user[key];
    }
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch(e) {
    // find better error code
    sendError(res, err, 500);
  }
});

router.delete('/:pk', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.pk);
    await user.destroy();
    res.status(204).send('No Content');
  } catch(err) {
    sendError(res, err, 500);
  }
});

module.exports = router;