'use strict';

module.exports = {
  wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }
};