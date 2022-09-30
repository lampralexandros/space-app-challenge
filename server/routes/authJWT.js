import env from '../config/env';
import jwt from 'jsonwebtoken';
import Sentry from '@sentry/node';

export default class AuthJwt {
  static generateToken (payload) {
    return jwt.sign(payload, env.JWT_SECRET_KEY(), {
      expiresIn: env.JWT_ACCESS_TOKEN_LIFE()
    });
  }

  static generateRefreshToken (payload) {
    return jwt.sign(payload, env.JWT_REFRESH_KEY(), {
      expiresIn: env.JWT_REFRESH_TOKEN_LIFE()
    });
  }

  static decryptToken (token, key) {
    token = token.indexOf(' ') > -1 ? token.split(' ')[1] : token;
    try {
      return jwt.verify(token, key);
    } catch (err) {
      handleErrors(err);
      throw err;
    }
  }

  static async asyncDecryptToken (token, key) {
    token = token.indexOf(' ') > -1 ? token.split(' ')[1] : token;
    try {
      return await jwt.verify(token, key);
    } catch (err) {
      handleErrors(err);
      throw err;
    }
  }

  static authenticateToken (req, res, next) {
    // login does not require jwt verification
    env.DEV_MODE() === 'true' && console.log(req.path);
    if (
      req.path === '/api/authenticate/loginToGitHub' ||
      req.path === '/api/authenticate/callback' ||
      req.path === '/api/authenticate/refreshJWT' ||
      req.path === '/api/authenticate/loginAccount'
    ) {
      // next middleware
      return next();
    }
    // Gather the jwt access token from the request header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // if there isn't any token
    // Token verification
    try {
      jwt.verify(token, env.JWT_SECRET_KEY());
    } catch (err) {
      // Catch the JWT Expired or Invalid errors
      handleErrors(err);
      return res.status(401).json({ msg: err.message });
    }
    next();
  }
}

function handleErrors (err) {
  if (!(err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError')) {
    Sentry.captureException(err);
  }
}
