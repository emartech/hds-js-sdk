'use strict';

const RequestFactory = require('../../../lib/request-factory');
const HdsApi = require('../../');
const Segment = require('./');
const Timer = require('../../../lib/timer');
const config = require('../../../config');

describe('Segments ', function() {
  let subject;
  let request;

  beforeEach(function() {
    request = {
      post: this.sandbox.stub().resolves({ body: '{"replyCode":0,"poll_url":"/customers/123/segments/123abc"}' }),
      get: this.sandbox.stub().resolves({ body: '{"replyCode":0,"url":"https://hds-api/result.csv"}', statusCode: 200 })
    };
    this.sandbox.stub(RequestFactory, 'create').returns(request);
    this.sandbox.stub(RequestFactory, 'createWithoutCustomer');
    this.sandbox.stub(config.polling, 'wait', 5000);
    this.sandbox.stub(config.polling, 'attempts', 20);
    this.sandbox.stub(config.hds, 'host', 'www.real-hds.com');
    this.sandbox.stub(config.hds, 'secure', true);

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

    it('should send the create segment request only once', function*() {
      yield subject.create('SELECT event_time FROM emarsys_email_send');

      expect(request.post.callCount).to.eql(1);
    });

    it('should not poll for the result', function*() {
      yield subject.create('SELECT event_time FROM emarsys_email_send');

      expect(request.get.callCount).to.eql(0);
    });

    it('should return with the poll url', function*() {
      let pollUrl = yield subject.create('SELECT event_time FROM emarsys_email_send');

      expect(pollUrl).to.eql({ replyCode: 0, poll_url: '/segments/123abc' });
    });


    describe('when auto polling option is on', function() {
      let result;

      beforeEach(function*() {
        request.get = this.sandbox.stub();
        request.get.onCall(0).resolves({ body: '', statusCode: 204 });
        request.get.onCall(1).resolves({ body: '', statusCode: 204 });
        request.get.onCall(2).resolves({ body: '', statusCode: 204 });
        request.get.onCall(3).resolves({ body: '{"replyCode":0,"url":"https://hds-api/result.csv"}', statusCode: 200 });

        this.sandbox.stub(Timer, 'wait').resolves();

        result = yield subject.create('SELECT event_time FROM emarsys_email_send', { autoPoll: true });
      });


      it('should poll for the result', function() {
        expect(request.get).to.calledWithExactly('/segments/123abc');
      });


      it('should send the create segment request only once', function() {
        expect(request.post).to.calledOnce;
      });


      it('should periodically poll for the result', function() {
        expect(request.get).to.calledWithExactly('/segments/123abc');
      });


      it('should poll for the result as many times as necessary', function() {
        expect(request.get.callCount).to.eql(4);
      });


      it('should return with the result url', function() {
        expect(result).to.eql({ replyCode: 0, url: 'https://www.real-hds.com/result.csv' });
      });


      it('should wait some time between polls', function() {
        expect(Timer.wait).to.calledWith(config.polling.wait);
        expect(Timer.wait).to.calledThrice;
      });


      it('should stop polling after a while and raise error', function*() {
        request.get = this.sandbox.stub();
        request.get.resolves({ body: '', statusCode: 204 });

        try {
          yield subject.create('SELECT event_time FROM emarsys_email_send', { autoPoll: true });
        } catch (e) {
          expect(request.get.callCount).to.eql(config.polling.attempts);
          expect(e.message).to.eql('No result got in time');
          return;
        }

        throw new Error('should raise error');
      });

    });

  });


  describe('#poll', function() {

    it('should check for result on the poll url', function*() {
      yield subject.poll('/this/is/my/poll/url');

      expect(request.get).to.calledWithExactly('/this/is/my/poll/url');
    });


    it('should return null if segment is not ready yet', function*() {
      request.get = this.sandbox.stub().resolves({ body: '', statusCode: 204 });

      const result = yield subject.poll('/this/is/my/poll/url');

      expect(result).to.equal(null);
    });


    describe('return result if segment is ready', function() {

      it('should resolve with reply code and url', function*() {
        const result = yield subject.poll('/this/is/my/poll/url');

        expect(result).to.have.property('replyCode', 0);
        expect(result).to.have.property('url', 'https://www.real-hds.com/result.csv');
      });


      describe('.url', function() {

        it('should contain HDS host set in config', function*() {
          const result = yield subject.poll('/this/is/my/poll/url');

          expect(result.url).to.contain(config.hds.host);
        });

        it('should have HTTPS protocol if hds is secure', function*() {
          this.sandbox.stub(config.hds, 'secure', true);
          const result = yield subject.poll('/this/is/my/poll/url');

          expect(result.url).to.contain('https:');
        });

        it('should have HTTPS protocol if hds is secure', function*() {
          this.sandbox.stub(config.hds, 'secure', false);
          const result = yield subject.poll('/this/is/my/poll/url');

          expect(result.url).to.contain('http:');
        });

      });

    });


    it('should throw error if result is not found', function*() {
      const error = new Error('Non-existing segment');
      error.code = 404;
      request.get = this.sandbox.stub().rejects(error);

      try {
        yield subject.poll('/this/is/my/poll/url');
      } catch (e) {
        expect(e.message).to.eql('Non-existing segment');
        expect(e.code).to.eql(404);
        return;
      }

      throw new Error('should raise an error');
    });

  });

});

