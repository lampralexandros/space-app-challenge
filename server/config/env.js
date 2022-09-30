import dotenv from 'dotenv';
dotenv.config();
export default class env {
  static PORT () {
    return process.env.PORT || 5000;
  }

  static DB_URL () {
    return process.env.DB_URL;
  }

  // OAUTH2
  static CLIENT_ID () {
    return process.env.REACT_APP_CLIENT_ID;
  }

  static CLIENT_SECRET () {
    return process.env.REACT_APP_CLIENT_SECRET;
  }

  static REDIRECT_URI () {
    return process.env.REACT_APP_REDIRECT_URI;
  }

  static PROXY_URL () {
    return process.env.REACT_APP_PROXY_URL;
  }

  // JWT SECRET KEY
  // 63 random alpha-numeric characters (a-z, A-Z, 0-9)
  // from https://www.grc.com/passwords.htm
  static JWT_SECRET_KEY () {
    return process.env.JWT_SECRET_KEY;
  }

  static JWT_REFRESH_KEY () {
    return process.env.JWT_REFRESS_KEY || 'tempKey09082137908-090142';
  }

  static JWT_ACCESS_TOKEN_LIFE () {
    return process.env.JWT_ACCESS_TOKEN_LIFE || '900s';
  }

  static JWT_REFRESH_TOKEN_LIFE () {
    return process.env.JWT_REFRESH_TOKEN_LIFE || '86400s';
  }

  // CLIENT side url for redirects
  static CLIENT_URL () {
    return process.env.CLIENT_URL;
  }

  // Dev mode true or false
  static DEV_MODE () {
    return process.env.DEV_MODE || 'false';
  }

  // Staging enviroment
  static STAGING_ENV () {
    return process.env.STAGING_ENVIRONMENT || 'develop';
  }

  // read the version from npm
  static VERSION () {
    return process.env.npm_package_version;
  }

  // sentry DNS
  static SENTRY_DNS () {
    //  return process.env.SENTRY_DNS || 'false';
    return (
      process.env.SENTRY_DNS ||
      'https://f33f7531f83348a586d49d402bf6f131@o461424.ingest.sentry.io/5466331'
    );
  }

  static GENERATOR_SERVICE_URL () {
    return process.env.GENERATOR_SERVICE_URL;
  }

  static GITHUB_ACCOUNT_TOKEN () {
    return process.env.GITHUB_ACCOUNT_TOKEN;
  }
}
