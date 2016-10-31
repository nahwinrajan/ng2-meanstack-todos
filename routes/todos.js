var express = require('express');
var router  = express.Router();
var mongojs = require('mongojs');
var db      = mongojs('mongodb://black_beard:password@ds139327.mlab.com:39327/meanapp-todos', ["todos"]);

// Get todos
router.get('/todos', function(req, res, next){
  db.todos.find(function(err, todos){
    if(err){
      res.send(err);
    } else {
      res.json(todos);
    }
  });
});

// Get single todo
router.get('/todo/:id', function(req, res, next) {
  db.todos.findOne({
    _id: mongojs.ObjectId(req.params.id)
  }, function(err, todo) {
    if(err) {
      res.send(err);
    } else {
      res.json(todo);
    }
  });
});

// Save todo
router.post('/todo', function(req, res, next){
  var todo = req.body;
  if(!todo.text || !(todo.isCompleted + '')) {
    res.status(400);
    res.json({
      "error": "Invalid Data"
    });
  } else {
    db.todos.save(todo, function(err, result){
      if(err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  }
});

// update todo
router.put('/todo/:id', function(req, res, next){
  var todo = req.body;
  var oUpdate = {};

  if(todo.isCompleted) {
    oUpdate.isCompleted = todo.isCompleted;
  }

  if(todo.text) {
    oUpdate.text = todo.text;
  }

  if(!oUpdate) {
    res.status(400);
    res.json({
      "error": "Invalid Data"
    });
  } else {
    db.todos.update({
      _id: mongojs.ObjectId(req.params.id)
    }, oUpdate, {}, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result);
      }
    });
  }
});

// Delete todo
router.delete('/todo/:id', function(req, res, next){
  db.todos.remove({
    _id: mongojs.ObjectId(req.params.id)
  }, '', function(err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
