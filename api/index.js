'use strict';

const RequestFactory = require('../lib/request-factory');
const Segments = require('./endpoints/segments');
const DailyDump = require('./endpoints/daily-dump');


class HdsApi {

  static create(params) {
    params = params || {};
    const request = RequestFactory.create(params.customerId);
    const requestWithoutCustomer = RequestFactory.createWithoutCustomer();

    return new HdsApi(request, requestWithoutCustomer);
  }


  constructor(request, requestWithoutCustomer) {
    this._request = request;
    this._requestWithoutCustomer = requestWithoutCustomer;
  }


  get segments() {
    return Segments.create(this._request);
  }

  get dailyDump() {
    return DailyDump.create(this._requestWithoutCustomer);
  }

}

module.exports = HdsApi;
