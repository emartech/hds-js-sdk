'use strict';

const Timer = require('../../../lib/timer');
const POLL_WAIT = 5000;
const POLL_MAX_ATTEMPTS = 20;

class Segments {

  static create(request) {
    return new Segments(request);
  }


  constructor(request) {
    this._request = request;
  }


  create(query, params) {
    params = params || {};
    let segmentPromise = this._request.post('/segments', { query: query }).then(response => JSON.parse(response.body));

    if (params.autoPoll) {
      return this._polling(segmentPromise);
    }

    return segmentPromise;
  }


  poll(path) {
    return this._request.get(path).then(this._checkResponse);
  }


  _checkResponse(response) {
    if (response.statusCode === 204) {
      return null;
    }

    return JSON.parse(response.body);
  }


  _polling(segmentPromise, attempts = 0) {
    if (attempts >= POLL_MAX_ATTEMPTS) {
      return Promise.reject(new Error('No result got in time'));
    }

    return segmentPromise.then(response => {
      return this.poll(response.poll_url).then(result => {
        if (result) {
          return result;
        }
        return Timer.wait(POLL_WAIT).then(() => this._polling(segmentPromise, attempts + 1));
      });
    });
  }
}


module.exports = Segments;
