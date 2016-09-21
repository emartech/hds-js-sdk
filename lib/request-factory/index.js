'use strict';

const SuiteRequest = require('escher-suiteapi-js');
const KeyPool = require('escher-keypool');
const config = require('../../config');

class RequestFactory {

  static create(customerId) {
    const credentials = KeyPool.create(config.escher.keyPool).getActiveKey(config.hds.escherKeyId);

    let options = Object.assign({ environment: config.hds.host, allowEmptyResponse: true }, config.hds);

    let prefix = options.prefix.replace('{customer}', `customers/${customerId}`);
    const requestOptions = SuiteRequest.Options.create(options, prefix);

    requestOptions.setHeader(['x-suite-customerid', customerId]);

    return SuiteRequest.create(credentials.keyId, credentials.secret, requestOptions);
  }


  static createWithoutCustomer() {
    const credentials = KeyPool.create(config.escher.keyPool).getActiveKey(config.hds.escherKeyId);

    let options = Object.assign({ environment: config.hds.host, allowEmptyResponse: true }, config.hds);

    const requestOptions = SuiteRequest.Options.create(options, '');

    return SuiteRequest.create(credentials.keyId, credentials.secret, requestOptions);
  }

}


module.exports = RequestFactory;
