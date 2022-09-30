import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

/**
 * This function initialize express
 *
 * @return {express.app}  app an initialized express app
 */
export default function loadExpress () {
  // Initiate the app
  const app = express();

  // Configure our app
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(cookieParser());
  app.use(cors());
  // Enabled Access-Control-Allow-Origin", "*" in the header so as to by-pass the CORS error.
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
  return app;
}
