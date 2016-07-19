import mapsUtils from './maps-utils';

const Directions = mapsUtils.createApi(mapsApi => ({
  query: (query, done) => mapsApi.directions(query, done),
  transform: result => result
}));

export {Directions};
