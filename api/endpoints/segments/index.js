'use strict';

const Timer = require('../../../lib/timer');
const config = require('../../../config');
const Domain = require('../../../lib/domain/domain');

class Segments {

  static create(request) {
    return new Segments(request);
  }


  constructor(request) {
    this._request = request;
  }


  create(query, params) {
    params = params || {};
    let segmentPromise = this._request.post('/segments', { query: query })
      .then(response => JSON.parse(response.body))
      .then(response => Object.assign(response, {
        poll_url: response.poll_url.replace(/\/customers\/\d+/, '')
      }));

    if (params.autoPoll) {
      return this._polling(segmentPromise);
    }

    return segmentPromise;
  }


  poll(path) {
    return this._request.get(path).then(this._checkResponse.bind(this));
  }


  _checkResponse(response) {
    if (response.statusCode === 204) {
      return null;
    }

    let result = JSON.parse(response.body);
    result.url = Domain.replaceToPublic(result.url);
    return result;
  }


  _polling(segmentPromise, attempts) {
    attempts = attempts || 0;
    if (attempts >= config.polling.attempts) {
      return Promise.reject(new Error('No result got in time'));
    }

    return segmentPromise.then(response => {
      return this.poll(response.poll_url).then(result => {
        if (result) {
          return result;
        }
        return Timer.wait(config.polling.wait).then(() => this._polling(segmentPromise, attempts + 1));
      });
    });
  }
}


module.exports = Segments;
