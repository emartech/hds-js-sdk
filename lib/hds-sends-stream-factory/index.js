'use strict';

const fs = require('fs');
const path = require('path');
const HdsRequestFactory = require('../hds-request-factory');
const Delay = require('../delay');

const POLL_COUNT = 10;
const POLL_DELAY = 1000;

class HdsSendsStreamFactory {

  constructor(customerId) {
    this._customerId = customerId;
  }

  static create(customerId) {
    return new HdsSendsStreamFactory(customerId);
  }

  createStream() {
    const hdsApiRequest = HdsRequestFactory.create(this._customerId);
    const queryParam = { query: 'SELECT contact_id, campaign_id, campaign_type, event_time FROM emarsys_email_send' };
    hdsApiRequest.post('/segments', queryParam);

    return fs.createReadStream(path.resolve(__dirname, '..', '..', '..', 'hds_email_send.csv'));
  }

  *createFileStream(metric) {
    const registerResponse = yield this._registerSegment(metric);

    const pollResponse = yield this._pollSegment(registerResponse);

    return this._getResult(pollResponse.url);
  }

  *_registerSegment(metric) {
    return yield HdsRequestFactory.create(this._customerId)
      .registerSegment(metric);
  }

  *_pollSegment(registerResponse) {
    let hasResponse = false;
    let pollResponse = null;
    let pollCount = 0;

    while (!hasResponse && pollCount < POLL_COUNT) {
      try {
        pollResponse = yield this._pollSegmentResult(registerResponse);
        hasResponse = true;
      } catch (e) {
        pollCount++;
        yield Delay.wait(POLL_DELAY);
      }
    }

    if (!pollResponse) {
      throw new Error('No response received during polling');
    }

    return pollResponse;
  }

  *_pollSegmentResult(response) {
    return yield HdsRequestFactory.create(this._customerId)
      .pollSegmentResult(response.poll_url);
  }

  _getResult(resultUrl) {
    return HdsRequestFactory.create(this._customerId)
      .getResult(resultUrl);
  }
}

module.exports = HdsSendsStreamFactory;
