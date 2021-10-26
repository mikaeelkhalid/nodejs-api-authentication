const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/user.model');

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createError.BadRequest('Email and password are required');
    }

    const doesExist = await User.findOne({ email });
    if (doesExist) {
      throw createError.Conflict('Email already exists');
    }
    const user = new User({ email, password });
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
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
