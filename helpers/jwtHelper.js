const JWT = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};

      const secret = process.env.ACCESS_TOKEN_SECRET;

      const options = {
        expiresIn: '20s',
        issuer: 'mikaeelkhalid.github.io',
        audience: userId,
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
        } else {
          resolve(token);
        }
      });
    });
  },
  verifyAccessToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return next(createError.Unauthorized());
    }

    const bearerToken = authHeader.split(' ');

    const token = bearerToken[1];

    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
        return next(createError.Unauthorized(message));
      }

      req.payload = payload;
      next();
    });
  },
};
