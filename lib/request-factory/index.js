'use strict';

const SuiteRequest = require('escher-suiteapi-js');
const KeyPool = require('escher-keypool');
const config = require('../../config');

module.exports = {

  create(customerId) {
    const credentials = KeyPool.create(config.escher.keyPool).getActiveKey(config.hds.escherKeyId);
    const options = SuiteRequest.Options.create(config.hds);

    options.setHeader([['x-suite-customerid', customerId]]);

    return SuiteRequest.create(credentials.keyId, credentials.secret, options);
  }

};
