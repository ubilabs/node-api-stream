/* eslint-disable no-unused-expressions */
import {expect} from 'chai';
import * as geoapi from '../src/index.js';

describe('index', () => {
  it('should export a geocoding interface', () => {
    expect(geoapi.Geocoding).to.be.a('function');
  });
  it('should export a static maps interface', () => {
    expect(geoapi.staticMaps).to.exist;
  });
  it('should export a directions interface', () => {
    expect(geoapi.Directions).to.be.a('function');
  });
});
