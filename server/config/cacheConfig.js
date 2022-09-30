import env from './env';

/**
 *  This is the resource cache init sentryOptions using checkperiod: (default: 600)
 *  check https://www.npmjs.com/package/node-cache accessed 9/09/2021
 */
const cacheResourceOptions = {
  stdTTL: Number.parseInt(env.JWT_REFRESH_TOKEN_LIFE().slice(0, -1))
};

export default cacheResourceOptions;
