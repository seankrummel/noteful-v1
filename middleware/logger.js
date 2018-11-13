'use strict';

const morgan = require('morgan');

// function requestLogger(req, res, next) {
//   return morgan(':date :method :url');
// }

module.exports = { requestLogger: morgan(':date :method :url') };