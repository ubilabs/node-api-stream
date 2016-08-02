var WikiSearchAPI = require('./wikistream.js');

// create an API stream which runs with a maximum of
// 10 queries per second, and caches results in wiki.db
var wikiStream = new WikiSearchAPI({
  qps: 10,
  cacheFile: 'wiki.db'
});
wikiStream.on('data', d => console.log(d));
wikiStream.on('end', () => console.log('Done.'));

wikiStream.write('Hamburg');
wikiStream.write('Ubilabs');
wikiStream.write('NodeJS');
wikiStream.end();
