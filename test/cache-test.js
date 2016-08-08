/* eslint-disable no-unused-expressions */
import {expect} from 'chai';
import fs from 'fs';
import Cache from '../src/cache.js';

const cacheName = 'testcache.db';

describe('The cache', () => {
  afterEach(done => {
    fs.exists(cacheName, exists => {
      if (exists) {
        fs.unlinkSync(cacheName);
      }

      done();
    });
  });

  it('should create a new instance', () => {
    const cache = new Cache(cacheName);

    expect(cache).to.exist;
  });

  it('should create a new cache file depending on the name', () => {
    const cache = new Cache(cacheName); // eslint-disable-line no-unused-vars

    expect(fs.existsSync(cacheName)).to.be.true;
  });

  it('should be possible to add and retrieve new entries', done => {
    const cache = new Cache(cacheName),
      testLocation = {lat: 50, lng: 10},
      testLocationName = 'MyLocation';

    cache.add(testLocationName, testLocation, () => {
      expect(cache.get(testLocationName)).to.exist;
      expect(cache.get(testLocationName)).to.deep.equal(testLocation);
      done();
    });
  });

  it('should have a `close` method', () => {
    const cache = new Cache(cacheName);

    expect(cache.close).to.be.a('function');
  });

  it('should persist entries', done => {
    const cache = new Cache(cacheName),
      testLocation = {lat: 50, lng: 10},
      testLocationName = 'MyLocation';

    cache.add(testLocationName, testLocation, () => {
      cache.close();
    });

    cache.on('close', () => {
      const newCache = new Cache(cacheName);

      expect(newCache.get(testLocationName)).to.exist;
      expect(newCache.get(testLocationName)).to.deep.equal(testLocation);
      done();
    });
  });

  it('should return nothing when entry not exists', () => {
    const cache = new Cache(cacheName);

    expect(cache.get('MyLocation')).to.not.exist;
  });
});
