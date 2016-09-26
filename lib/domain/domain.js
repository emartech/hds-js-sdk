'use strict';

const url = require('url');
const config = require('../../config');

class Domain {
  static replaceToPublic(privateUrl) {
    let urlParts = url.parse(privateUrl);
    urlParts.host = config.hds.host;
    urlParts.protocol = config.hds.secure ? 'https:' : 'http:';
    return url.format(urlParts);
  }
}

module.exports = Domain;
