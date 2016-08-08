# api-stream

Create streaming, rate-limited APIs with ease

```sh
npm install api-stream --save
```

## Usage

Creating a streaming, rate-limited, caching Wikipedia search API:

```js
var https = require('https'),
  apiStream = require('api-stream'),
  apiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';

module.exports = apiStream.createApi(constructorOptions => (query, done) => {
  https.get(apiURL + encodeURIComponent(query), res => {
    var response = '';

    if(res.statusCode !== 200) {
      done({status: res.statusCode}, null);
      return;
    }

    res.on('data', d => response += d);
    res.on('end', () => done(null, JSON.parse(response)));
  });
});
```

Using the created API:

```js
var WikiSearchAPI = require('./wikistream.js');

// create an API stream which runs with a maximum of
// 10 queries per second, and caches results in wiki.db
var wikiStream = new WikiSearchAPI({
  queriesPerSecond: 10,
  cacheFile: 'wiki.db'
});
wikiStream.on('data', d => console.log(d));
wikiStream.on('end', () => console.log('Done.'));

wikiStream.write('Hamburg');
wikiStream.write('Ubilabs');
wikiStream.write('NodeJS');
wikiStream.end();
```

## API-Stream Documentation

**apiStream.createApi(initialiseEndpoint, endpointDefaultOptions = {})**

* initialiseEndpoint `<Function>` Endpoint initialisation function
* endpointDefaultOptions `<Object>` Default options for the constructor of the created class

The endpoint initialisation function must take an `options` object as parameter. The options can be user-defined upon initialisation of the generated API class. The endpoint initialisation function should return an *endpoint function*. The endpoint function is called for every item written to the generated API stream. It is passed two parameters:

* **query:** Type: `?`. The query written to the stream, after it has been passed through the `accessor` function.
* **done:** Type: `Function`. A callback function which must be called once, after the API query is completed. Pass an error as first parameter to indiciate failure, or `null` to indicate success. Pass the API response as second parameter.

## Generated Class Documentation

The constructor of created stream class accepts an options object.  
The options object is used to define some behaviour (e.g. queriesPerSecond, caching), and is then passed on as parameter to `initialiseEndpoint`.  
All default values may be overriden by re-defining the value in `endpointDefaultOptions`.  
By default, the created stream classes support the following options:

* **options.queriesPerSecond:** Type: `Number`, default: `35`. Defines the maximum number of requests per second. Must be at least `1`.
* **options.cacheFile:** Type: `String`, default: `null`. Defines the name of the cache file to be used. The cache is disable if no name has been defined.
* **options.accessor:** Type: `Function`, default: `data => data`. Items written to the stream will be passed through `options.accessor` before being passed as query to `queryEndpoint`.
* **options.stats:** Type: `Object`, default: `{current: 0}`. A statistics object which will be attached to each result. The `options.stats.current` property is increment on each query.
