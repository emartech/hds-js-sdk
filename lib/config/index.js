'use strict';

module.exports = {
  hds: {
    host: process.env.HDS_HOST || 'api.emarsys.net',
    port: process.env.HDS_PORT || 443,
    escherKeyId: process.env.HDS_ESCHER_KEY_ID,
    credentialScope: process.env.HDS_CREDENTIAL_SCOPE || 'eu/suite/ems_request',
    secure: process.env.HDS_UNSECURE !== 'true',
    rejectUnauthorized: true,
    prefix: process.env.HDS_PREFIX || '/api/hds'
  },

  escher: {
    keyPool: process.env.SUITE_ESCHER_KEY_POOL
  }
};
