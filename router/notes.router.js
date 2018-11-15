'use strict';

const express = require('express');
const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/', (req, res, next) => {
  const {searchTerm} = req.query;
  // notes.filter(searchTerm, (err, list) => {
  //   if (err) return next(err);
  //   res.json(list);
  // });
  notes.filter(searchTerm).then(list => res.json(list)).catch(err => next(err));
});
router.get('/:id', (req, res, next) => {
  const id = Number(req.params.id);
  // notes.find(id, (err, item) => {
  //   if (err) return next(err);
  //   if (item) res.json(item);
  //   else res.json('not found');
  // });
  notes.find(id).then(item => {
    if (item) res.json(item);
    else next();
  }).catch(err => next(err));
});

router.put('/:id', (req, res, next) => {
  const id = req.params.id;

  const updateObj = {};
  const updateFields = ['title', 'content'];
  updateFields.forEach(field => {
    if (field in req.body) updateObj[field] = req.body[field];
  });

  // notes.update(id, updateObj, (err, item) => {
  //   if (err) return next(err);
  //   if (item) res.json(item);
  //   else next();
  // });
  notes.update(id, updateObj).then(item => {
    if (item) res.json(item);
    else next();
  }).catch(err => next(err));
});

router.post('/', (req, res, next) => {
  const {title, content} = req.body;
  
  const newItem = {title, content};
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status(404);
    return next(err);
  }

  // notes.create(newItem, (err, item) => {
  //   if (err) return next(err);
  //   if (item) res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
  //   else next();
  // });
  notes.create(newItem).then(item => {
    if (item) res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    else next();
  }).catch(err => next(err));
});

router.delete('/:id', (req, res, next) => {
  const {id} = req.params;
  // notes.delete(id, err => {
  //   if (err) return next(err);
  //   res.status(204).end();
  // });
  notes.delete(id).then(() => res.status(204).end()).catch(err => next(err));
});

module.exports = router;