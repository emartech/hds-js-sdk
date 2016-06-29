'use strict';

const Api = require('./');
const RequestFactory = require('../lib/request-factory');

describe('HDS API', function() {

  describe('.create', function() {
    let result;

    beforeEach(function() {
      this.sandbox.stub(RequestFactory, 'create');
      result = Api.create({ customerId: '[customer id]' });
    });


    it('should return an instance', function() {
      expect(result).to.be.an.instanceOf(Api);
    });


    it('should create a new request with correct customerId parameter', function() {
      expect(RequestFactory.create).to.have.been.calledWithExactly('[customer id]');
    });

  });


});
