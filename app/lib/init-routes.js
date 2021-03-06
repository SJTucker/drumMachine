'use strict';

var d = require('../lib/request-debug');
var initialized = false;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = require('../routes/home');
  var users = require('../routes/users');

  app.get('/', d, home.index);
  app.post('/', d, users.saveBeat);
  app.get('/user/:name', d, users.loadBeat);
  app.get('/register', d, users.new);
  app.post('/register', d, users.create);
  app.get('/login', d, users.login);
  app.post('/login', d, users.authenticate);
  console.log('Routes Loaded');
  fn();
}

