import mongoose from 'mongoose';
import Sentry from '@sentry/node';

/**
 * This function initialize mongo
 * @param {string} DB_URL the database url
 * @param {string} DEV_MODE a flag concerning debug
 * @return {mongoose.connection} connection an initialized connection
 */
export default function loadMongoose (DB_URL, DEV_MODE) {
  mongoose.connect(DB_URL).catch(error => {
    DEV_MODE === 'true' && console.log('error loading mongo', error);
    Sentry.captureException(error);
  });
  mongoose.set('debug', DEV_MODE === 'true');
  return mongoose.connection;
}
