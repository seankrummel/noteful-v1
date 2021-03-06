'use strict';

const app = require('../server.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

describe('Reality check', function() {
  it('true should be true', function() {
    expect(true).to.be.true;
  });
  it('2 + 2 should equal 4', function() {
    expect(2 + 2).to.equal(4);
  });
});

describe('Express static', function() {
  it('GET request "/" should return the index page', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
});

describe('404 handler', function() {
  it('should respond with 404 when given a bad path', function() {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(function(res) {
        expect(res).to.have.status(404);
      });
  });
});

describe('GET /api/notes', function() {
  it('should return the default of 10 notes as an array', function() {
    return chai.request(app)
      .get('/api/notes')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.equal(10);
      });
  });
  it('should return an array of objects with the id, title, and content', function() {
    return chai.request(app)
      .get('/api/notes')
      .then(function(res) {
        res.body.forEach(function(object) {
          expect(object).to.have.keys('id', 'title', 'content');
        });
      });
  });
  it('should return a correct search results for a valid query', function() {
    const searchTerm = 'cats';
    return chai.request(app)
      .get('/api/notes')
      .query({searchTerm})
      .then(function(res) {
        res.body.forEach(function(object) {
          expect(object.title).to.include(searchTerm);
        });
      });
  });
  it('should return an empty array for an incorrect query', function() {
    const searchTerm = 'INCORRECT QUERY';
    return chai.request(app)
      .get('/api/notes')
      .query({searchTerm})
      .then(function(res) {
        expect(res.body.length).to.equal(0);
      });
  });
});

describe('GET /api/notes/:id', function() {
  it('should return correct note object with id, title, and content', function() {
    let data = {};
    return chai.request(app)
      .get('/api/notes')
      .then(function(res) {
        data.id = res.body[0].id;
        data.title = res.body[0].title;
        data.content = res.body[0].content;
        return chai.request(app)
          .get(`/api/notes/${data.id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(data);
      });
  });
  it('should respond with a 404 for an invalid id (/api/notes/DOESNOTEXIST)', function() {
    return chai.request(app)
      .get('/api/notes/DOESNOTEXIST')
      .then(function(res) {
        expect(res).to.have.status(404);
      });
  });
});

describe('POST /api/notes', function() {
  it('should create and return a new item with location header when provided valid data', function() {
    const newData = {title: 'title', content: 'content'};
    return chai.request(app)
      .post('/api/notes')
      .send(newData)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.header).to.contain.keys('location');
      });
  });
  it('should return an object with a message property "Missing title in request body" when missing "title" field', function() {
    const newData = {content: 'content'};
    return chai.request(app)
      .post('/api/notes')
      .send(newData)
      .then(function(res) {
        expect(res).to.have.status(404);
        expect(res.body).to.be.a('object');
        expect(res.body.message).to.equal('Missing `title` in request body');
      });
  });
});

describe('PUT /api/notes/:id', function() {
  it('should update and return a note object when given valid data', function() {
    const updateData = {title: 'title', content: 'content'};
    return chai.request(app)
      .get('/api/notes')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/api/notes/${updateData.id}`)
          .send(updateData);
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(updateData);
      });
  });
  it('should respond with a 404 for an invalid id (api/notes/DOESNOTEXIST)', function() {
    return chai.request(app)
      .put('/api/notes/DOESNOTEXIST')
      .then(function(res) {
        expect(res).to.have.status(404);
      });
  });
  // it('should return an object with a message property "Missing title in request body" when missing "title" field', function() {});
  // no it shouldn't
});

describe('DELETE /api/notes/:id', function() {
  it('should delete an item by id', function() {
    return chai.request(app)
      .get('/api/notes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/api/notes/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
});
