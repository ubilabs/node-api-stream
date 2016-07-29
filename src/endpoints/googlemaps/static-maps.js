import mapsUtils from './maps-utils';

const staticMaps = {
  URL: mapsUtils.createApi(mapsApi => ({
    query: (query, done) => {
      const response = mapsApi.staticMap(query);
      done(null, response);
    },
    transform: result => result
  })),
  Image: mapsUtils.createApi(mapsApi => ({
    query: (query, done) => mapsApi.staticMap(query, done),
    transform: result => result
  }))
};

export {staticMaps};
