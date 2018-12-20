const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/test';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*Create new user */
router.post('/create', function (req, res, next) {
  const user ={
    name: req.body.name,
    surname: req.body.surname,
    age: req.body.age
  };
  mongo.connect(url, function (error, client) {
    assert.strictEqual(null, error);
    const db = client.db('test');
    db.collection('userList').insertOne(user, function (error, result) {
      assert.strictEqual(null, error);
      console.log('Item insert');
      client.close();
    })
  });
  getData();
  res.redirect('/read');
});

/* GET Data from DB */
function getData(){
  router.get('/read', function(req, res, next){
    const dataArr = [];
    mongo.connect(url, function(error, client){
      assert.strictEqual(null, error);
      const db = client.db('test');
      const data = db.collection('userList').find();
      data.forEach(function (doc, error) {
        dataArr.push(doc);
      }, function () {
        client.close();
        res.render('index', {items: dataArr});
      })
    })
  });

}
router.get('/read', function(req, res, next){
  const dataArr = [];
  mongo.connect(url, function(error, client){
    assert.strictEqual(null, error);
    const db = client.db('test');
    const data = db.collection('userList').find();
    data.forEach(function (doc, error) {
      dataArr.push(doc);
    }, function () {
      client.close();
      res.render('index', {items: dataArr});
    })
  })
});


module.exports = router;
