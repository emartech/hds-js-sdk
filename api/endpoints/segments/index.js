'use strict';

class Segments {

  static create(request) {
    return new Segments(request);
  }


  constructor(request) {
    this._request = request;
  }


  create(query) {
    return this._request.post('/segments', { query: query }).then(response => JSON.parse(response.body));
  }


  poll(path) {
    return this._request.get(path).then(this._checkResponse);
  }


  _checkResponse(response) {
    if (response.statusCode === 204) {
      return null;
    }

    return JSON.parse(response.body);
  }
}


module.exports = Segments;
