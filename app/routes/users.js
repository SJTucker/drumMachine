'use strict';

var User = require('../models/user');

exports.new = function(req, res){
  res.render('users/new', {title: 'Register User'});
};

exports.create = function(req, res){
  var user = new User(req.body);
  user.register(function(){
    if(user._id){
      res.redirect('/');
    }else{
      res.render('users/new', {title: 'Register User'});
    }
  });
};

exports.login = function(req, res){
  res.render('users/login', {title: 'Login User'});
};

exports.authenticate = function(req, res){
  User.findByEmailAndPassword(req.body.email, req.body.password, function(user){
    if(user){
      user.sliceEmail(user.email, function(){
        req.session.regenerate(function(){
          req.session.userId = user._id;
          req.session.save(function(){
            res.redirect('/');
          });
        });
      });
    }else{
      res.render('users/login', {title: 'Login User'});
    }
  });
};

exports.saveBeat = function(req, res){
  User.findById(req.session.userId.toString(), function(user){
    user.saveBeat(req.body.name?req.body.name:'',
                  req.body.kickQueue?req.body.kickQueue:'',
                  req.body.snareQueue?req.body.snareQueue:'',
                  req.body.hatQueue?req.body.hatQueue:'',
                  req.body.tomQueue?req.body.tomQueue:'',
                  req.body.ohatQueue?req.body.ohatQueue:'',
                  req.body.aQueue?req.body.aQueue:'',
                  req.body.bQueue?req.body.bQueue:'',
                  req.body.cQueue?req.body.cQueue:'',
                  req.body.dQueue?req.body.dQueue:'',
                  req.body.eQueue?req.body.eQueue:'',
                  req.body.fQueue?req.body.fQueue:'',
                  req.body.gQueue?req.body.gQueue:'',
                  function(){
      res.redirect('/');
    });
  });
};

exports.loadBeat = function(req, res){
  User.findById(req.session.userId.toString(), function(user){
    user.loadBeat(req.params.name, function(beat){
      res.send({beat:beat});
    });
  });
};
