'use strict';

const RequestFactory = require('../../../lib/request-factory');
const HdsApi = require('../../');
const Segment = require('./');


describe('Segments ', function() {
  let subject;
  let request;
  let createResponse;
  let pollResponse;

  beforeEach(function() {
    createResponse = '{"replyCode":0,"poll_url":"/customers/123/segments/123abc"}';
    pollResponse = '{"replyCode":0,"url":"https://hds-api/result.csv"}';

    request = {
      post: this.sandbox.stub().resolves({ body: createResponse }),
      get: this.sandbox.stub().resolves({ body: pollResponse, statusCode: 200 })
    };
    this.sandbox.stub(RequestFactory, 'create').returns(request);

    subject = HdsApi.create(8823).segments;
  });


  it('should be an instance of Segments', function() {
    expect(subject).to.be.an.instanceOf(Segment);
  });


  describe('#create', function() {

    it('should send a create segment request to the endpoint', function*() {
      yield subject.create('SELECT event_time FROM emarsys_email_send');

      expect(request.post).to.calledWithExactly('/segments', { query: 'SELECT event_time FROM emarsys_email_send' });
    });


    it('should return with the poll url', function*() {
      let pollUrl = yield subject.create('SELECT event_time FROM emarsys_email_send');

      expect(pollUrl).to.eql(JSON.parse(createResponse));
    });

  });


  describe('#poll', function() {

    it('should check for result on the poll url', function*() {
      yield subject.poll('/customers/123/segments/123abc');

      expect(request.get).to.calledWithExactly('/customers/123/segments/123abc');
    });


    it('should return null if segment is not ready yet', function*() {
      request.get = this.sandbox.stub().resolves({ body: '', statusCode: 204 });

      const result = yield subject.poll('/customers/123/segments/123abc');

      expect(result).to.equal(null);
    });


    it('should return result url if segment is ready', function*() {
      const result = yield subject.poll('/customers/123/segments/123abc');

      expect(result).to.eql({ replyCode: 0, url: 'https://hds-api/result.csv' });
    });


    it('should throw error if result is not found', function*() {
      const error = new Error('Non-existing segment');
      error.code = 404;
      request.get = this.sandbox.stub().rejects(error);

      try {
        yield subject.poll('/customers/123/segments/123abc');
      } catch (e) {
        expect(e.message).to.eql('Non-existing segment');
        expect(e.code).to.eql(404);
        return;
      }

      throw new Error('should raise an error');
    });

  });


  // it('should return url returned from polling', function*() {
  //   RequestFactory.prototype.pollSegmentResult
  //     .onCall(0).throws(new Error('Empty response'));
  //   RequestFactory.prototype.pollSegmentResult
  //     .onCall(1)
  //     .returns(Promise.resolve({ url: 'http://path-to-download' }));
  //
  //
  //   yield subject.create('any hdsql query');
  //
  //   expect(RequestFactory.prototype.pollSegmentResult).to.have.been.calledTwice;
  //   expect(Delay.wait).to.have.been.calledWith(1000);
  // });

});

