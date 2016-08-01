import sinon from 'sinon';

export default {
  getMockEndpoint(result = 'result', error = null) {
    return options => ({ // eslint-disable-line no-unused-vars
      transform: sinon.stub().returnsArg(0),
      query: sinon.stub().callsArgWith(1, error, result)
    });
  }
};
