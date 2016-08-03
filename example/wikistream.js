var https = require('https'),
  apiStream = require('../dist/index'),
  apiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=';

module.exports = apiStream.createApi(options => (query, done) => {
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
