import flatfile from 'flat-file-db';

function stringifyKey(key) {
  if (typeof key === 'string') {
    return key;
  }

  return JSON.stringify(key);
}

/**
 * Cache instance to store key value pairs.
 * @type {Class}
 * @param {string} cacheFile The name of the file to cache
 */
export default class Cache {
  /**
   * Constructs the Cache.
   * @param  {string} cacheFile The filename for the cache.
   */
  constructor(cacheFile) {
    this.db = flatfile.sync(cacheFile);
  }

  /**
   * Add new entries to the cache
   * @param {string}   key  The key that shall be cached
   * @param {Object}   value The value that should be stored in the cache
   * @param {Function} callback Callback function of form callback(err, result);
   */
  add(key, value, callback = () => {}) {
    this.db.put(stringifyKey(key), value, error => {
      callback(error || null, value);
    });
  }

  /**
   * Retrieve an entry from the cache
   * @param {string} key  The key that should be retrieved
   * @return {Object} The value
   */
  get(key) {
    return this.db.get(stringifyKey(key));
  }

  /*
   * Close stream to the cache file
   */
  close() {
    return this.db.close();
  }

  /*
   * Register a database event
   * @param {string} event The name of the event to register (e.g. 'close')
   * @param {Function} callback Callback function
   */
  on(event, callback) {
    this.db.on(event, callback);
  }
}
