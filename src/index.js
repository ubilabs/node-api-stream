import ThrottledTransform from '../../node-throttled-transform-stream/dist/throttled-transform'; // eslint-disable-line max-len
import Cache from './cache';

const defaults = {
  queriesPerSecond: 35,
  accessor: data => data,
  stats: {
    current: 0
  }
};

export default {
  /**
   * A helper function for easily creating rate-limited, streaming APIs.
   * This function serves as a factory for creating stream API classes.
   * It takes an API endpoint initialisation function as parameter, and
   * returns a NodeJS `stream.Transform` class.
   *
   * The API endpoint initialisation function is a function which takes an
   * `options` object as parameter. This object may contain user-defined
   * options (e.g. api keys, ...). It should return an endpoint function.
   * The endpoint function taking two parameters. The first parameter is the
   * user's query. The endpoint may define the query's format and data type.
   * The second parameter is a `done` function, which the endpoint must call
   * after the query is done. The endpoint must pass an error or `null` as first
   * parameter, and the response as second parameter. The query result will not
   * be cached if the error has a truthy value.
   *
   * The returned transform stream can optionally cache results, transform input
   * data using a user-supplied accessor function before passing the query to
   * the API endpoint, and appends meta data to the API results before they are
   * emitted.
   *
   * @param {Function} initialiseEndpoint The endpoint initialisation function
   * @param {Object} endpointDefaultOptions Default options for this endpoint
                                            This allows to define default QPS,
                                            default stats, a default accessor,
                                            or similar for the endpoint.
   * @return {Function} A streaming API class
   **/
  createApi(initialiseEndpoint, endpointDefaultOptions = {}) {
    // allow endpoints to set their own default options
    const defaultOptions = Object.assign({}, defaults, endpointDefaultOptions);

    return class API extends ThrottledTransform {
      constructor(options) {
        options = Object.assign({}, defaultOptions, options);

        super(options.queriesPerSecond, {objectMode: true});

        if (options.cacheFile) {
          this.cache = new Cache(options.cacheFile);
        }

        this.queryEndpoint = initialiseEndpoint(options);
        this.accessor = options.accessor;
        this.stats = options.stats;
      }

      _skipThrottle(input) {
        if (!this.cache) {
          return false;
        }

        const query = this.accessor(input),
          cachedResponse = this.cache.get(query);

        if (cachedResponse) {
          return {
            input,
            query,
            stats: this.getStats(),
            response: cachedResponse,
            error: false,
            cached: true
          };
        }

        return cachedResponse || false;
      }

      _throttledTransform(input, encoding, done) {
        const query = this.accessor(input),
          stats = this.getStats(),
          metaData = {input, query, stats};

        this.queryEndpoint(query, (error, response) => {
          // add result to cache if cache is set and no error occurred
          if (this.cache && !error && response) {
            this.cache.add(query, response);
          }

          const result = {
            response: response ? response : {},
            error: error ? error : false,
            cached: false
          };

          // append `result` to meta data and push to stream
          done(null, Object.assign(result, metaData));
        });
      }

      getStats() {
        this.stats.current++;
        // create copy of this.stats to keep end user from overwriting stats
        return Object.assign({}, this.stats);
      }
    };
  }
};
