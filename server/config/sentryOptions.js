// creating the options for sentry
import env from './env';

const sentryOptions =
  env.SENTRY_DNS() !== 'false'
    ? {
        enabled: env.SENTRY_DNS() !== 'false',
        dsn: env.SENTRY_DNS(),
        // We recommend adjusting this value in production, or using tracesSampler
        // for finer control
        tracesSampleRate: 1.0,
        release: 'wably-backend-' + env.VERSION(),
        environment: env.STAGING_ENV
      }
    : {
        enabled: 'false'
      };

export default sentryOptions;
