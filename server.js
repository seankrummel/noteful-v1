'use strict';

const express = require('express');
const app = express();

const {PORT} = require('./config');
const {requestLogger} = require('./middleware/logger.js');

const notesRouter = require('./router/notes.router.js');

app.use(requestLogger);

app.use(express.static('public'));
app.use(express.json());

app.use('/api/notes', notesRouter);

app.use((req, res) => {
  let err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({message: 'Not Found'});
});
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({message: err.message, error: err});
});

app.listen(PORT, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => console.error(err));
