import NodeCache from 'node-cache';
import { cacheResourceOptions } from '../config/index';

/**
 * This function initialize the cache for resources
 * @return {NodeCache} a instantiated node cache for resources
 */

class ResourceCache {
  constructor () {
    if (!this.resourceCache) {
      this.resourceCache = new NodeCache(cacheResourceOptions);
    }
  }

  get cache () {
    return this.resourceCache;
  }
}

export default new ResourceCache();
