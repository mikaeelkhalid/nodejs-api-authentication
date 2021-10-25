const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
require('dotenv').config();

const app = express();

app.get('/', async (req, res) => {
  await res.status(200).json({
    message: 'hello world',
  });
});

app.use(async (req, res, next) => {
  await next(createError.NotFound());
});

app.use(async (err, req, res, next) => {
  await res.status(err.status || 500);
  await res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
