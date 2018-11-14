'use strict';

const morgan = require('morgan');

function requestLogger(req, res, next) {
  morgan('dev')(req, res, next);
}

module.exports = { requestLogger };