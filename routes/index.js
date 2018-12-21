const express = require('express');
const router = express.Router();
const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');

const url = 'mongodb://localhost:27017/test'; //url of Database server
const dbName = 'test'; //name of database

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* CREATE Create new user */
router.post('/create', function (req, res, next) {
  const user ={
    name: req.body.name,
    surname: req.body.surname,
    age: req.body.age
  };
  mongo.connect(url, {useNewUrlParser: true}, function (error, client) {
    assert.strictEqual(null, error);
    const db = client.db(dbName);
    db.collection('userList').insertOne(user, function (error, result) {
      assert.strictEqual(null, error);
      console.log('Item insert');
      getData();
      res.redirect('/read');
      client.close();
    })
  });
});

/*READ GET Data from DB */
function getData(){
  router.get('/read', function(req, res, next){
    const dataArr = [];
    mongo.connect(url, { useNewUrlParser: true }, function(error, client){
      assert.strictEqual(null, error);
      const db = client.db(dbName);
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
  mongo.connect(url, { useNewUrlParser: true }, function(error, client){
    assert.strictEqual(null, error);
    const db = client.db(dbName);
    const data = db.collection('userList').find();
    data.forEach(function (doc, error) {
      dataArr.push(doc);
    }, function () {
      client.close();
      res.render('index', {items: dataArr});
    })
  })
});

/*UPDATE Update user */
router.post('/update', function(req, res, next){
  const user ={
    name: req.body.name,
    surname: req.body.surname,
    age: req.body.age
  };
  const userId = req.body.id;
  mongo.connect(url, { useNewUrlParser: true }, function (error, client) {
    assert.strictEqual(null, error);
    const db = client.db(dbName);
    db.collection('userList').updateOne({"_id" : objectId(userId)}, {$set: user}, function(error, result) {
      assert.strictEqual(null, error);
      console.log('Item updated');
      res.redirect('/read');
      client.close();
    });
  });
});
/*DELETE Delete user */
router.post('/delete', function(req, res, next){
  const userId = req.body.id;
  mongo.connect(url, { useNewUrlParser: true }, function (error, client){
    assert.strictEqual(null, error);
    const db = client.db(dbName);
    db.collection('userList').deleteOne({"_id" : objectId(userId)}, function (error, result) {
      assert.strictEqual(null, error);
      console.log('Item deleted');
      res.redirect('/read');
      client.close();
    })
  });
});

module.exports = router;
