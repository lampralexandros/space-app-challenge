import { loginToAccount } from '../../controller/loginToAccount';
import express from 'express';
import auth from '../authJWT';
import queryString from 'querystring';
import env from '../../config/env';
import githubApi from '../githubApi';
import { UserController } from '../../controller/index';
import Sentry from '@sentry/node';
// Request to redirect the user to sign in to github
const router = express.Router();
router.get('/loginToGitHub', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?scope=read:user,user:email&client_id=${env.CLIENT_ID()}`
  );
});

router.get('/callback', (req, res) => {
  let accessToken;
  let jwt;
  let refreshTokenJWT;
  let githubUser;
  githubApi
    .getGitHubToken(req.query.code)
    .then(response => {
      if (response.error != null) throw new Error(response);
      if (env.DEV_MODE() === 'true') {
        console.log('getGitHubToken response', response);
      }
      accessToken = response.accessToken;
      return response;
    })
    .then(response => {
      const user = githubApi.getGitHubUserAndMail(response.accessToken);
      if (env.DEV_MODE() === 'true') console.log('user', user);
      return user;
    })
    .then(user => {
      githubUser = user;
      const retrievedUser = UserController.findOrCreateUser(user, accessToken);
      if (env.DEV_MODE() === 'true') {
        console.log('retrievedUser', retrievedUser);
      }
      return retrievedUser;
    })
    .then(retrievedUser => {
      jwt = auth.generateToken({ userId: retrievedUser._id });
      refreshTokenJWT = auth.generateRefreshToken({
        userId: retrievedUser._id
      });
      const userAnswer = {
        ownedProjects: retrievedUser.ownedProjects,
        accessToken: jwt,
        refreshTokenJWT: refreshTokenJWT,
        jwtExpires: env.JWT_ACCESS_TOKEN_LIFE(),
        refreshExpires: env.JWT_REFRESH_TOKEN_LIFE(),
        login: retrievedUser.name,
        email: retrievedUser.email,
        followers: githubUser.followers,
        public_repos: githubUser.public_repos,
        owned_private_repos: githubUser.owned_private_repos,
        git_image_user: githubUser.avatar_url,
        messages: retrievedUser.messages
      };
      return userAnswer;
    })
    .then(user => {
      if (env.DEV_MODE() === 'true') {
        console.log(
          'redirection url',
          env.CLIENT_URL(),
          'redirection user',
          user
        );
      }
      res.redirect(env.CLIENT_URL() + `/login?${queryString.stringify(user)}`);
    })
    .catch(error => {
      if (!/code/.test(error.message)) Sentry.captureException(error);
      res.redirect(
        env.CLIENT_URL() +
        `/login?${queryString.stringify({ error: 'something went wrong!' })}`
      );
    });
});

router.get('/refreshJWT', (req, res) => {
  // Gather the jwt access token from the request header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // if there isn't any token
  // Token verification
  try {
    const decoded = auth.decryptToken(token, env.JWT_REFRESH_KEY());
    const newJWT = auth.generateToken({ userId: decoded.userId });
    res.send({ accessToken: newJWT });
  } catch (err) {
    // Catch the JWT Expired or Invalid errors
    if (
      !(err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError')
    ) {
      Sentry.captureException(err);
    }
    return res.status(401).json({ msg: err.message });
  }
});

router.post('/loginAccount', (req, res) => {
  loginToAccount(req.body)
    .then(retrievedUser => {
      if (!retrievedUser) {
        return res.status(403).json({ msg: 'wrong credentials' });
      }
      return res.status(200).json({ retrievedUser });
    })
    .catch(error => {
      return res.status(500).json({ msg: error });
    });
});

export default router;
