const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/user.model');
const { authSchema } = require('../helpers/validationSchema');

router.post('/register', async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);

    const { email, password } = result;

    const doesExist = await User.findOne({ email });

    if (doesExist) {
      throw createError.Conflict(`${email} already exists`);
    }

    const user = new User({ email, password });

    const savedUser = await user.save();

    res.send(savedUser);
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
    }
    next(error);
  }
});

router.post('/login', async (req, res) => {
  res.send('login');
});

router.post('/referesh-token', async (req, res) => {
  res.send('referesh-token');
});

router.delete('/logout', async (req, res) => {
  res.send('logout');
});

module.exports = router;
