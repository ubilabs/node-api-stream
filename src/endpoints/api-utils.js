import ThrottledTransform from '../../../node-throttled-transform-stream/dist/throttled-transform'; // eslint-disable-line max-len
import Cache from '../cache';

const defaults = {
  queriesPerSecond: 35,
  accessor: data => data,
  stats: {
    current: 0
  }
};

export default {
  createApi(initialiseEndpoint) {
    return class API extends ThrottledTransform {
      constructor(options) {
        options = Object.assign({}, defaults, options);

        super(options.queriesPerSecond, {objectMode: true});

        if (options.cacheFile) {
          this.cache = new Cache(options.cacheFile);
        }

        this.endpoint = initialiseEndpoint(options);
        this.accessor = options.accessor;
        this.stats = options.stats;
      }

      _skipThrottle(data) {
        if (!this.cache) {
          return false;
        }

        const query = this.accessor(data),
          cachedResult = this.cache.get(query);

        if (cachedResult) {
          return Object.assign(this.getMetaData(data, query),
            this.getStats(),
            cachedResult
          );
        }

        return cachedResult;
      }

      _throttledTransform(data, encoding, done) {
        const query = this.accessor(data),
          result = this.getMetaData(data, query);

        this.endpoint.query(query, (error, response) => {
          result.response = response ? response : result.response;

          if (this.cache && !error) {
            this.cache.add(query, Object.assign({}, result, {cached: true}));
          }

          result.error = error ? error : result.error;

          done(null, Object.assign(this.getStats(), result));
        });
      }

      getMetaData(input, query) {
        return {
          input,
          query,
          response: {},
          cached: false,
          error: false
        };
      }

      getStats() {
        this.stats.current++;

        return {
          stats: Object.assign({}, this.stats)
        };
      }
    };
  }
};
