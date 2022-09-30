// This is a api module providing function to consume gitHub Api
// refer to documentation
// @author lamrpalex
import fetch from 'node-fetch';

import env from '../config/env';
import Sentry from '@sentry/node';

// Request to exchange code for an access token
export async function getGitHubToken (code) {
  const params = new URLSearchParams();
  params.append('client_id', env.CLIENT_ID());
  params.append('client_secret', env.CLIENT_SECRET());
  params.append('code', code);
  params.append('redirect_uri', env.REDIRECT_URI());

  try {
    let response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: params
    });
    response = await response.text();
    if (response.search('error_description=') !== -1) throw new Error(response);
    response = await new URLSearchParams(response);
    response = await response.get('access_token');
    return { accessToken: response };
  } catch (error) {
    let errorCode = errorHandle(error);
    if (!/code/.test(errorCode)) {
      Sentry.captureException(error);
      errorCode = 'code:500';
    }
    throw new Error(errorCode);
  }
}

// Request to return data of a user that has been authenticated
export async function getGitHubUser (accessToken) {
  const response = await fetch('https://api.github.com/user', {
    method: 'GET',
    headers: { Authorization: 'token ' + accessToken }
  });
  const user = await response.json();
  return user;
}

// Request to return email of a user that has been authenticated
export async function getGitHubUserMail (accessToken) {
  const response = await fetch(
    'https://api.github.com/user/emails?access_token=' + accessToken,
    {}
  );
  const mail = await response.json();
  return mail;
}

// Request to return the user and the first email that has been authenticated
export async function getGitHubUserAndMail (accessToken) {
  let response;
  let user;
  let mail;
  try {
    response = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: { Authorization: 'token ' + accessToken }
    });
    user = await response.json();
  } catch (error) {
    console.log(error);
  }
  try {
    response = await fetch('https://api.github.com/user/emails', {
      method: 'GET',
      headers: { Authorization: 'token ' + accessToken }
    });
    mail = await response.json();
    user.email = mail[0].email;
  } catch (error) {
    console.log(error);
  }
  return user;
}

function errorHandle (error) {
  if (/error=bad_verification_code/.test(error)) {
    return 'code:407';
  }

  return '';
}

export default {
  getGitHubUserAndMail,
  getGitHubUserMail,
  getGitHubUser,
  getGitHubToken
};
