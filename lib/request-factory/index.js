'use strict';

const SuiteRequest = require('escher-suiteapi-js');
const KeyPool = require('escher-keypool');
const config = require('../../config');

module.exports = {

  create(customerId) {
    const credentials = KeyPool.create(config.escher.keyPool).getActiveKey(config.hds.escherKeyId);

    let options = Object.assign({ environment: config.hds.host }, config.hds);

    const requestOptions = SuiteRequest.Options.create(options);

    requestOptions.setHeader(['x-suite-customerid', customerId]);

    return SuiteRequest.create(credentials.keyId, credentials.secret, requestOptions);
  }

};
