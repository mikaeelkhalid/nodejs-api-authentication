const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../models/user.model');
const { authSchema } = require('../helpers/validationSchema');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../helpers/jwtHelper');
const { verify } = require('jsonwebtoken');
const client = require('../helpers/initRedis');

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
    const refreshToken = await signRefreshToken(savedUser.id);

    res.send({ accessToken, refreshToken });
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
    const refreshToken = await signRefreshToken(user.id);

    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true) {
      next(createError.BadRequest('Invalid credentials'));
    }
    next(error);
  }
});

router.post('/referesh-token', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw createError.BadRequest();
    }
    const userId = await verifyRefreshToken(refreshToken);
    const accessToken = await signAccessToken(userId);
    const refToken = await signRefreshToken(userId);
    res.send({ accessToken, refreshToken: refToken });
  } catch (error) {
    next(error);
  }
});

router.delete('/logout', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw createError.BadRequest();
    }

    const userId = await verifyRefreshToken(refreshToken);

    client.del(userId, (err, reply) => {
      if (err) {
        console.log(err.message);
        throw createError.InternalServerError();
      }
      console.log(reply);
      res.sendStatus(204);
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
