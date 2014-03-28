/* jshint expr:true */

'use strict';

process.env.DBNAME = 'drumMachine-test';
var expect = require('chai').expect;
var Mongo = require('mongodb');
var User;
var bob;

describe('User', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      bob = new User({role:'host', email:'bob@nomail.com', password:'1234'});
      bob.register(function(){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new User object', function(){
      var u1 = new User({role:'host', email:'bob@nomail.com', password:'1234'});
      expect(u1).to.be.instanceof(User);
      expect(u1.email).to.equal('bob@nomail.com');
      expect(u1.password).to.equal('1234');
    });
  });

  describe('#register', function(){
    it('should register a new User', function(done){
      var u1 = new User({role:'guest', email:'samj@outlook.com', password:'1234'});
      u1.register(function(err, body){
        expect(err).to.not.be.ok;
        expect(u1.password).to.have.length(60);
        expect(u1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
    it('should not register a new User', function(done){
      var u1 = new User({role:'guest', email:'bob@nomail.com', password:'1234'});
      u1.register(function(err){
        expect(u1._id).to.be.undefined;
        done();
      });
    });
  });

  describe('.findByEmailAndPassword', function(){
    it('should find a user', function(done){
      User.findByEmailAndPassword('bob@nomail.com', '1234', function(user){
        expect(user).to.be.ok;
        done();
      });
    });
    it('should not find user - bad email', function(done){
      User.findByEmailAndPassword('wrong@nomail.com', '1234', function(user){
        expect(user).to.be.undefined;
        done();
      });
    });
    it('should not find user - bad password', function(done){
      User.findByEmailAndPassword('bob@nomail.com', 'wrong', function(user){
        expect(user).to.be.undefined;
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a user by id', function(done){
      var u1 = new User({name: 'Sam', email:'sam@nomail.com', password:'1234'});
      u1.register( function(){
        User.findById(u1._id.toString(), function(record){
          expect(u1.email).to.equal('sam@nomail.com');
          expect(u1.password).to.not.equal('1234');
          expect(record._id).to.deep.equal(u1._id);
          done();
        });
      });
    });
  });

  describe('.saveBeat', function(){
    it('should save the users beat', function(done){
      var kickQueue = [1,3];
      var snareQueue = [];
      var hatQueue = [];
      bob.saveBeat(kickQueue, snareQueue, hatQueue, function(){
        expect(bob.beats).to.have.length(1);
        done();
      });
    });
  });

  describe('.sliceEmail', function(){
    it('should return the email before the @', function(done){
      bob.sliceEmail(bob.email, function(){
        expect(bob.slicedEmail).to.equal('bob');
        done();
      });
    });
  });

});

