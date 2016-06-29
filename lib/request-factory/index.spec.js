'use strict';

const SuiteRequest = require('escher-suiteapi-js');
const RequestFactory = require('../request-factory');
const config = require('../../config');

describe('Request Factory', function() {
  let request;
  let options;
  const dummyHdsConfig = {
    host: '',
    escherKeyId: 'service-key',
    credentialScope: 'eu/asd/asd'
  };

  beforeEach(function() {
    options = new SuiteRequest.Options('dummy host', {});
    this.sandbox.stub(options, 'setHeader');
    this.sandbox.stub(config.escher, 'keyPool', JSON.stringify([{ keyId: 'service-key_v1', secret: 'secret' }]));
    this.sandbox.stub(config, 'hds', dummyHdsConfig);
    this.sandbox.stub(SuiteRequest, 'create').returns('[dummy suite request]');
    this.sandbox.stub(SuiteRequest.Options, 'create').returns(options);

    request = RequestFactory.create('[customer id]');
  });


  it('should return a SuiteRequest', function() {
    expect(request).to.eql('[dummy suite request]');
  });


  it('should pass the correct params to SuiteRequest', function() {
    expect(SuiteRequest.create).to.calledWithExactly('service-key_v1', 'secret', options);
  });


  it('should pass the correct params to SuiteRequest Option', function() {
    expect(SuiteRequest.Options.create).to.calledWithExactly(dummyHdsConfig);
  });


  it('should set customer id header on SuiteRequest Option', function() {
    expect(options.setHeader).to.calledWithExactly([['x-suite-customerid', '[customer id]']]);
  });

});
