'use strict';

let Domain = require('../../../lib/domain/domain');

class DailyDump {

  static create(request) {
    return new DailyDump(request);
  }

  constructor(request) {
    this._request = request;
  }

  getByTable(tableName, date) {
    return this._request.get(`/daily_dump/${tableName}/${date}`)
      .then((response) => {
        if (response.statusCode === 202) {
          throw new Error('Daily dump is not ready');
        }

        if (response.statusCode !== 200) {
          throw new Error(`Unexpected status code ${response.statusCode}`);
        }

        let result = JSON.parse(response.body);
        result.url = Domain.replaceToPublic(result.url);
        return result;
      });
  }
}


module.exports = DailyDump;
