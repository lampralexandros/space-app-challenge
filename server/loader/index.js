import env from '../config/env';
import loadExpress from './loadExpress';
import loadMongoose from './loadMongoose';
import ResourceCache from './loadCache';

export default class Loader {
  /**
   * This function acts as a wrapper for various initializations
   */
  init () {
    this.app = loadExpress();
    console.log('express initialized');
    this.connection = loadMongoose(env.DB_URL(), env.DEV_MODE());
    console.log('mongoose initialized');
    this.resourceCache = ResourceCache.cache;
    console.log('cache initialized');
  }
}
