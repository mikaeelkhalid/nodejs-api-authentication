const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const client = require('../helpers/initRedis');

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

  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};

      const secret = process.env.REFRESH_TOKEN_SECRET;

      const options = {
        expiresIn: '1y',
        issuer: 'mikaeelkhalid.github.io',
        audience: userId,
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
        } else {
          client.set(userId, token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
            if (err) {
              console.log(err.message);
              reject(createError.InternalServerError());
              return;
            } else {
              resolve(token);
            }
          });
        }
      });
    });
  },
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) {
            return reject(createError.Unauthorized());
          }
          const userID = payload.aud;
          client.get(userID, (err, result) => {
            if (err) {
              console.log(err.message);
              reject(createError.InternalServerError());
              return;
            }

            if (refreshToken === result) {
              return resolve(userID);
            }
            reject(createError.Unauthorized());
          });
        }
      );
    });
  },
};
