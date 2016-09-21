'use strict';

const SuiteRequest = require('escher-suiteapi-js');
const RequestFactory = require('../request-factory');
const config = require('../../config');

describe('Request Factory', function() {

  let request;

  describe('default behavior via API Proxy', function() {

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
    });

    describe('#create', function() {

      beforeEach(function() {
        request = RequestFactory.create(123456);
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
        expect(options).to.have.property('allowEmptyResponse', true);
      });


      it('should set customer id header on SuiteRequest Option', function() {
        expect(request.getOptions().headers).to.deep.include.members([
          ['x-suite-customerid', 123456],
          ['host', 'my-dummy-host']
        ]);
      });
    });

    describe('#createWithoutCustomer', function() {
      it('should not set any customer id specific parameter on SuiteRequest Option', function() {

        request = RequestFactory.createWithoutCustomer();

        let headerKeys = request.getOptions().headers.map((header) => header[0]);
        expect(headerKeys).to.not.include('x-suite-customerid');
        expect(headerKeys).to.include('host');
      });
    });
  });


  describe('special behavior for direct connection', function() {

    it('should prepare prefix if contains {customer} placeholder', function() {
      this.sandbox.stub(config.escher, 'keyPool', '[{"keyId":"service-key_v1","secret":"secret"}]');
      this.sandbox.stub(config, 'hds', { prefix: 'my/prefix/{customer}' });

      expect(RequestFactory.create(123456).getOptions()).to.have.property('prefix', 'my/prefix/customers/123456');
    });

  });

});
