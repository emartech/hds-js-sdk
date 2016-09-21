'use strict';

let DailyDump = require('./index');

describe('DailyDump', function() {

  let request;

  beforeEach(function() {
    request = {
      get: this.sandbox.stub().resolves({ body: '{"url":"https://hds-api/result.csv"}', statusCode: 200 })
    };
  });

  describe('#getByTable', function() {

    it('should call the endpoint with the given table name and date', function*() {
      let subject = DailyDump.create(request);
      let tableName = 'email_sends';
      let date = '2016-08-11';

      yield subject.getByTable(tableName, date);

      expect(request.get).calledWithExactly('/daily_dump/email_sends/2016-08-11');
    });

    it('should return with the parsed json on successful request', function*() {
      let subject = DailyDump.create(request);

      let result = yield subject.getByTable('email_sends', '2016-08-11');

      expect(result).to.eql({ url: 'https://hds-api/result.csv' });
    });

    it('should throw an error when the dump is not ready', function*() {
      let subject = DailyDump.create(request);
      request.get.resolves({ body: '{}', statusCode: 202 });

      try {
        yield subject.getByTable('email_sends', '2016-08-11');
        throw new Error('Should throw error');
      } catch (e) {
        expect(e.message).to.eql('Daily dump is not ready');
      }
    });

    it('should throw an error when unexpected statusCode given', function*() {
      let subject = DailyDump.create(request);
      request.get.resolves({ body: '{}', statusCode: 400 });

      try {
        yield subject.getByTable('email_sends', '2016-08-11');
        throw new Error('Should throw error');
      } catch (e) {
        expect(e.message).to.eql('Unexpected status code 400');
      }
    });
  });
});
