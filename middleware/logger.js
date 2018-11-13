'use strict';

const morgan = require('morgan');

function requestLogger(req, res, next) {
  morgan(':date :method :url')(req, res, next);
}

module.exports = { requestLogger };