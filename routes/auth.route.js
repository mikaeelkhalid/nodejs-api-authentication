const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/user.model');
const { authSchema } = require('../helpers/validationSchema');
const { signAccessToken } = require('../helpers/jwtHelper');

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
    const accessToken = await signAccessToken(savedUser.id);

    res.send({ accessToken });
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
    }
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const { email, password } = result;

    const user = await User.findOne({ email });

    if (!user) {
      throw createError.NotFound(`${email} does not register with us!`);
    }

    const isMatch = await user.isValidPassword(password);

    if (!isMatch) {
      throw createError.Unauthorized('Invalid password');
    }

    const accessToken = await signAccessToken(user.id);

    res.send({ accessToken });
  } catch (error) {
    if (error.isJoi === true) {
      next(createError.BadRequest('Invalid credentials'));
    }
    next(error);
  }
});

router.post('/referesh-token', async (req, res) => {
  res.send('referesh-token');
});

router.delete('/logout', async (req, res) => {
  res.send('logout');
});

module.exports = router;
