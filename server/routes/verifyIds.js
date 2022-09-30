import UserProfile from '../models/UserProfile';
import AuthJwt from './authJWT';
import Sentry from '@sentry/node';
import env from '../config/env';

export default async function verifyUserIdsAndAttachToReq (req, res, next) {
  // login does not require jwt verification

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
  // Token verification
  try {
    const decoded = AuthJwt.decryptToken(token, env.JWT_SECRET_KEY());
    // check against db entries
    const user = await UserProfile.findById(decoded.userId).exec();
    if (user == null) throw new Error('User does not exists');
    if (req.method === 'GET') req.query.registeredUserId = decoded.userId;
    else if (req.method === 'POST') req.body.registeredUserId = decoded.userId;
    else if (req.method === 'PUT') req.body.registeredUserId = decoded.userId;
    else if (req.method === 'DELETE') {
      req.query.registeredUserId = decoded.userId;
    } else {
      throw new Error(
        'Server does not recongize the type' + req.method + ' of the request'
      );
    }
  } catch (err) {
    // Catch the JWT Expired or Invalid errors
    Sentry.captureException(err);
    return res.status(401).json({ msg: err.message });
  }

  // next middleware

  next();
}
