'use strict';

const SuiteRequest = require('escher-suiteapi-js');
const RequestFactory = require('../request-factory');
const config = require('../../config');

describe('Request Factory', function() {

  let request;

  beforeEach(function() {
    this.sandbox.stub(config.escher, 'keyPool', '[{"keyId":"service-key_v1","secret":"secret"}]');
    this.sandbox.stub(config, 'hds', {
      host: 'my-dummy-host',
      port: 'my-port',
      escherKeyId: 'service-key',
      credentialScope: 'my/credential/scope',
      rejectUnauthorized: 'my-reject-unauthorized-value',
      secure: 'my-secure-value',
      prefix: 'my/prefix'
    });
    this.sandbox.spy(SuiteRequest, 'create');

    request = RequestFactory.create('[customer id]');
  });


  it('should return a SuiteRequest', function() {
    expect(request).to.be.an.instanceof(SuiteRequest);
  });


  it('should pass the correct params to SuiteRequest', function() {
    expect(SuiteRequest.create).to.calledWith('service-key_v1', 'secret');
  });


  it('should set proper options', function() {
    const options = request.getOptions();

    expect(options).to.have.property('host', 'my-dummy-host');
    expect(options).to.have.property('port', 'my-port');
    expect(options).to.have.property('rejectUnauthorized', 'my-reject-unauthorized-value');
    expect(options).to.have.property('secure', 'my-secure-value');
    expect(options).to.have.property('credentialScope', 'my/credential/scope');
    expect(options).to.have.property('prefix', 'my/prefix');
  });


  it('should set customer id header on SuiteRequest Option', function() {
    expect(request.getOptions().headers).to.deep.include.members([
      ['x-suite-customerid', '[customer id]'],
      ['host', 'my-dummy-host']
    ]);
  });

});
