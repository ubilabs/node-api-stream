import mapsUtils from './maps-utils';

const Geocoding = mapsUtils.createApi(mapsApi => ({
  query: (query, done) => {
    if (typeof query === 'string') {
      query = {address: query};
    }

    mapsApi.geocode(query, done);
  },
  transform: result => result
}));

export {Geocoding};
