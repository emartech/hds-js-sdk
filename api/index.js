'use strict';

const RequestFactory = require('../lib/request-factory');
const Segments = require('./endpoints/segments');


class HdsApi {

  static create(params) {
    params = params || {};
    const request = RequestFactory.create(params.customerId);

    return new HdsApi(request);
  }


  constructor(request) {
    this._request = request;
  }


  get segments() {
    return Segments.create(this._request);
  }

}

module.exports = HdsApi;
