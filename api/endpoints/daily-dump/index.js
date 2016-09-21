'use strict';

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

        return JSON.parse(response.body);
      });
  }
}


module.exports = DailyDump;
