/* eslint-disable no-unused-expressions, max-nested-callbacks */
import {expect} from 'chai';
import stream from 'stream';
import apiUtils from '../src/endpoints/api-utils';
import helpers from './lib/helpers';

describe('api-utils', () => {
  it('should export a `createApi` function', () => {
    expect(apiUtils.createApi).to.be.a('function');
  });

  describe('createApi', () => {
    it('should return a class given an endpoint', () => {
      const endpoint = helpers.getMockEndpoint();

      expect(apiUtils.createApi(endpoint)).to.be.a('function');
    });

    describe('the created class', () => {
      it('should return a class which is a transform stream', () => {
        const endpoint = helpers.getMockEndpoint(),
          API = apiUtils.createApi(endpoint);

        expect(API.prototype)
          .to.be.instanceof(stream.Transform);
      });

      it('should push an object with the API response', done => {
        const result = 'some result',
          endpoint = helpers.getMockEndpoint(result),
          API = apiUtils.createApi(endpoint),
          apiInstance = new API();

        apiInstance.on('data', data => {
          expect(data.response).to.equal(result);
        });
        apiInstance.on('end', done);

        apiInstance.write('some query');
        apiInstance.end();
      });

      it('should push an object with the query', done => {
        const input = 'some input',
          endpoint = helpers.getMockEndpoint('some result'),
          API = apiUtils.createApi(endpoint),
          apiInstance = new API();

        apiInstance.on('data', data => {
          expect(data.query).to.equal(input);
        });
        apiInstance.on('end', done);

        apiInstance.write(input);
        apiInstance.end();
      });

      it('should push an object with the input', done => {
        const input = 'some input',
          endpoint = helpers.getMockEndpoint('some result'),
          API = apiUtils.createApi(endpoint),
          apiInstance = new API();

        apiInstance.on('data', data => {
          expect(data.input).to.equal(input);
        });
        apiInstance.on('end', done);

        apiInstance.write(input);
        apiInstance.end();
      });

      it('should push an object with a `cached` field', done => {
        const endpoint = helpers.getMockEndpoint('some result'),
          API = apiUtils.createApi(endpoint),
          apiInstance = new API();

        apiInstance.on('data', data => {
          expect(data.cached).to.be.a('boolean');
        });
        apiInstance.on('end', done);

        apiInstance.write('some query');
        apiInstance.end();
      });

      it('should push an object with a `stats` field', done => {
        const endpoint = helpers.getMockEndpoint('some result'),
          API = apiUtils.createApi(endpoint),
          apiInstance = new API();

        apiInstance.on('data', data => {
          expect(data.stats).to.be.an('object');
        });
        apiInstance.on('end', done);

        apiInstance.write('some query');
        apiInstance.end();
      });

      it('should push an object with a `stats.current` field', done => {
        const endpoint = helpers.getMockEndpoint('some result'),
          API = apiUtils.createApi(endpoint),
          apiInstance = new API();

        apiInstance.on('data', data => {
          expect(data.stats.current).to.be.a('number');
        });
        apiInstance.on('end', done);

        apiInstance.write('some query');
        apiInstance.end();
      });

      it('should push an object with an `error: false` field', done => {
        const endpoint = helpers.getMockEndpoint('some result'),
          API = apiUtils.createApi(endpoint),
          apiInstance = new API();

        apiInstance.on('data', data => {
          expect(data.error).to.be.false;
        });
        apiInstance.on('end', done);

        apiInstance.write('some query');
        apiInstance.end();
      });

      it('should set the `error` field on error', done => {
        const error = 'some error',
          endpoint = helpers.getMockEndpoint(null, error),
          API = apiUtils.createApi(endpoint),
          apiInstance = new API();

        apiInstance.on('data', data => {
          expect(data.error).to.equal(error);
        });
        apiInstance.on('end', done);

        apiInstance.write('some query');
        apiInstance.end();
      });
    });
  });
});