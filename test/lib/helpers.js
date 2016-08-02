import sinon from 'sinon';

export default {
  getMockEndpoint(result = 'result', error = null) {
    return options => // eslint-disable-line no-unused-vars
      sinon.stub().callsArgWith(1, error, result);
  }
};
