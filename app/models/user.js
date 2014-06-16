'use strict';

module.exports = User;
var bcrypt = require('bcrypt');
//var users = global.nss.db.collection('users');
var users = db.collection('users');
var _ = require('lodash');
var Mongo = require('mongodb');

function User(user){
  this.email = user.email || '';
  this.password = user.password;
  this.beats = [];
}

User.prototype.register = function(fn){
  var self = this;

  hashPassword(self.password, function(hashedPwd){
    self.password = hashedPwd;
    insert(self, function(err){
      fn(err);
    });
  });
};

function insert(user, fn){
  users.findOne({email:user.email}, function(err, userFound){
    if(!userFound){
      users.insert(user, function(err, record){
        fn(err);
      });
    }else{
      fn();
    }
  });
}

function hashPassword(password, fn){
  bcrypt.hash(password, 8, function(err, hash){
    fn(hash);
  });
}

User.findByEmailAndPassword = function(email, password, fn){
  users.findOne({email:email}, function(err, user){
    if(user){
      bcrypt.compare(password, user.password, function(err, result){
        if(result){
          fn(_.extend(user, User.prototype));
        }else{
          fn();
        }
      });
    }else{
      fn();
    }
  });
};

User.prototype.saveBeat = function(name,
                                   oldkickQueue,
                                   oldsnareQueue,
                                   oldhatQueue,
                                   oldtomQueue,
                                   oldohatQueue,
                                   aQueue,
                                   bQueu,
                                   cQueue,
                                   dQueue,
                                   eQueue,
                                   fQueue,
                                   gQueue,
                                   fn){
  var kickQueue = _.map(oldkickQueue, function(x){
    return parseInt(x);
  });
  var snareQueue = _.map(oldsnareQueue, function(x){
    return parseInt(x);
  });
  var hatQueue = _.map(oldhatQueue, function(x){
    return parseInt(x);
  });
  var tomQueue = _.map(oldtomQueue, function(x){
    return parseInt(x);
  });
  var ohatQueue = _.map(oldohatQueue, function(x){
    return parseInt(x);
  });
  var aQueue = _.map(aQueue, function(x){
    return parseInt(x);
  });
  var bQueue = _.map(bQueue, function(x){
    return parseInt(x);
  });
  var cQueue = _.map(cQueue, function(x){
    return parseInt(x);
  });
  var dQueue = _.map(dQueue, function(x){
    return parseInt(x);
  });
  var eQueue = _.map(eQueue, function(x){
    return parseInt(x);
  });
  var fQueue = _.map(fQueue, function(x){
    return parseInt(x);
  });
    var gQueue = _.map(gQueue, function(x){
    return parseInt(x);
  });

  var beat = {name:name,
              kickQueue:kickQueue,
              snareQueue:snareQueue,
              hatQueue:hatQueue,
              tomQueue:tomQueue,
              ohatQueue:ohatQueue,
              aQueue:aQueue,
              bQueue:bQueue,
              cQueue:cQueue,
              dQueue:dQueue,
              eQueue:eQueue,
              fQueue:fQueue,
              gQueue:gQueue};
  this.beats.push(beat);
  update(this, function(err){
    fn(err);
  });
  
};

function update(user, fn){
  users.update({_id:user._id}, user, function(err, count){
    fn(err);
  });
}

User.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  users.findOne({_id:_id}, function(err, record){
    if(record){
      fn(_.extend(record, User.prototype));
    }else{
      fn(null);
    }
  });
};

User.prototype.sliceEmail = function(email, fn){
  var index = email.indexOf('@');
  var slicedEmail = email.slice(0, index);
  this.slicedEmail = slicedEmail;
  update(this, function(err){
    fn(err);
  });
};

User.prototype.loadBeat = function(name, fn){
  console.log('inside loadbeat from model');
  var sendBeat;
  for(var i = 0; i < this.beats.length; i++){
    if(this.beats[i].name === name){
      console.log(this.beats[i].name);
      console.log(this.beats[i]);
      sendBeat = this.beats[i];
    }
  }
  fn(sendBeat);
};
