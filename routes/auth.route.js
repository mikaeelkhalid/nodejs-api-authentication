const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
  res.send('register');
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
