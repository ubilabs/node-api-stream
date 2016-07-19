import GoogleMaps from 'googlemaps';
import apiUtils from '../api-utils';

export default {
  createApi(initialiseEndpoint) {
    return apiUtils.createApi(options => {
      options = options.googleMaps || {};
      validateOptions(options);

      const mapsApi = new GoogleMaps(options),
        endpoint = initialiseEndpoint(mapsApi);

      return {
        query: (query, done) =>
          endpoint.query(query, (error, response) => {
            const errorMessage = getError(error, response);
            done(errorMessage, response);
          }),
        transform: endpoint.transform
      };
    });
  }
};

/**
 * Validate a Maps API options object
 * This function throws an exception if the options are invalid
 * @param {Object} options The options object to be validated
 **/
function validateOptions(options) {
  if ((options.clientId || options.privateKey) && options.key) {
    throw new Error('Can only specify credentials or API key');
  }

  if (options.clientId && !options.privateKey) {
    throw new Error('Missing privateKey');
  }

  if (!options.clientId && options.privateKey) {
    throw new Error('Missing clientId');
  }

  if (!options.key && !(options.clientId && options.privateKey)) {
    throw new Error('Must either provide credentials or API key');
  }
}

function getError(error, response) {
  if (!error && response.status === 'OK') {
    return null;
  }

  if (response) {
    return {
      code: response.status,
      message: response.error_message
    };
  }

  // googlemaps seems to return google maps API errors as JSON
  try {
    const parsedMessage = JSON.parse(error.message);
    if (parsedMessage.status) {
      return {
        code: parsedMessage.status,
        message: parsedMessage.error_message
      };
    }
  } catch (e) { // eslint-disable-line no-empty
  }

  // but other errors as normal Error object
  return {
    code: error.code,
    message: error.toString()
  };
}
