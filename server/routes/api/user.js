import express from 'express';
import AuthJwt from '../authJWT';
import githubApi from '../githubApi';
import UserProfile from '../../models/UserProfile';
import Sentry from '@sentry/node';
import UserController from '../../controller/user.controller';

const router = express.Router();
// get the User Profile from github
router.get('/getGitHubProfile', (req, res) => {
  const token = AuthJwt.authenticateToken(req, res);
  githubApi.getGitHubUserAndMail(token.accessToken).then(userFromGitHub => {
    try {
      res.status(200).send(userFromGitHub);
    } catch (error) {
      console.log('something went wrong');
      Sentry.captureException(error);
      res.sendStatus(500).send(error);
    }
  });
});

router.get('/getUser', (req, res) => {
  UserController.apiGetUser(req.query)
    .then(user =>
      res
        .status(200)
        .json({ name: user.name, _id: user._id, email: user.email })
    )
    .catch(error => {
      if (error.message.includes('400')) res.status(400).send(error.message);
      else res.status(500).send('contact admins');
    });
});

router.get('/:field', (req, res) => {
  UserController.apiGetUser({
    _id: req.query.registeredUserId.replace(/"/g, '')
  })
    .then(user => res.status(200).json(user[req.params.field]))
    .catch(error => {
      if (error.message.includes('400')) res.status(400).send(error.message);
      else res.status(500).send('contact admins');
    });
});

router.post('/createUser', (req, res) => {
  const userProf = new UserProfile({
    name: req.body.user.login,
    email: req.body.user.email,
    ownedProjects: []
  });
  userProf
    .save()
    .then(userProf => {
      return res.status(200).json(userProf._id);
    })
    .catch(err => {
      console.log(err);
      Sentry.captureException(err);
      return res.status(500).json();
    });
});

router.put('/', (req, res) => {
  console.log('hello put', req.body.user);
  UserController.updateUser(
    req.body.registeredUserId.replace(/"/g, ''),
    req.body.user
  )
    .then(user => {
      if (!user) throw new Error('no entry code:404');
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(returnHttpErrorCode(error));
      return res.json(error);
    });
});



// TODO: this need refactoring with a switch
function returnHttpErrorCode(error) {
  let code;
  if (error.message.includes('code:400')) code = 400;
  else if (error.message.includes('code:404')) code = 404;
  else if (error.message.includes('code:403')) code = 403;
  else {
    console.log(error);
    Sentry.captureException(error);
    code = 500;
  }
  return code;
}

export default router;
