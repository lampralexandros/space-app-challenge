// dependencies
import Sentry from '@sentry/node';
import AuthJwt from './routes/authJWT';
import sentryOptions from './config/sentryOptions';
import verifyUserIdsAndAttachToReq from './routes/verifyIds';
import env from './config/env';
import Loader from './loader/index';
import routes from './routes/index';

const PORT = env.PORT();
const DB_URL = env.DB_URL();
const DEV_MODE = env.DEV_MODE();
const SENTRY_DNS = env.SENTRY_DNS();
const VERSION = env.VERSION();
const ENVIRONMENT = env.STAGING_ENV();

console.log('---Configuration Parameters ---');
console.log('- Dev mode: ' + DEV_MODE + ' -');
console.log('- Your port is: ' + PORT + ' -');
console.log('- Your dbase is: ' + DB_URL + ' -');
console.log('- Version: ' + VERSION + ' -');
console.log(
  '- sentry-enabled with DNS ' + (SENTRY_DNS !== 'false' ? 'true -' : 'false -')
);
console.log('- staging enviroment: ' + ENVIRONMENT + ' -');
console.log('- ACCESS_TOKEN_LIFE time:' + env.JWT_ACCESS_TOKEN_LIFE());
console.log('- REFRESH_TOKEN_LIFE time:' + env.JWT_REFRESH_TOKEN_LIFE());
console.log('------------------------------');

// enable sentry
try {
  Sentry.init(sentryOptions);
} catch (error) {
  console.log(error);
}

const loader = new Loader();
loader.init();
const app = loader.app;
const connection = loader.connection;

connection.once('open', function () {
  console.log('Connection with MongoDB was successful');
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());

// Auth middleware
app.use((req, res, next) => {
  AuthJwt.authenticateToken(req, res, next);
});

// Verify against DB entryies the requestHandler
app.use((req, res, next) => {
  verifyUserIdsAndAttachToReq(req, res, next);
});

// Routes
app.use(routes);
// Listening on PORT
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
