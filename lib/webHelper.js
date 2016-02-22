/**
 * Created by Ukun on 16/2/21.
 */
'use strict';

module.exports = {
  reshook: function (error, next, callback, errorCallback) {
    if (error) {
      if (errorCallback) {
        errorCallback();
      } else {
        error.status = 500;
        next(error);
      }
    } else {
      callback();
    }
  }
};