'use strict';

const express = require('express');
// Load array of notes
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);
const app = express();
const {PORT} = require('./config');
const {requestLogger} = require('./middleware/logger.js');

// console.log('Hello Noteful!');

// INSERT EXPRESS APP CODE HERE...

app.use(requestLogger);

app.use(express.static('public'));
app.use(express.json());

app.get('/api/notes', (req, res, next) => {
  const {searchTerm} = req.query;
  notes.filter(searchTerm, (err, list) => {
    if (err) return next(err);
    res.json(list);
  });
});
app.get('/api/notes/:id', (req, res, next) => {
  const id = Number(req.params.id);
  notes.find(id, (err, item) => {
    if (err) return next(err);
    if (item) res.json(item);
    else res.json('not found');
  });
});

app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  const updateObj = {};
  const updateFields = ['title', 'content'];
  updateFields.forEach(field => {
    if (field in req.body) updateObj[field] = req.body[field];
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) return next(err);
    if (item) res.json(item);
    else next();
  });
});

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
