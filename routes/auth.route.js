const express = require('express');
const router = express.Router();
const createError = require('http-errors');

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createError.BadRequest('Email and password are required');
    }
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
