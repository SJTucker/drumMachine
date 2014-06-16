'use strict';

var dbname = process.env.DBNAME;
var port = process.env.PORT || 4000;

/*if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var redis = require("redis").createClient(rtg.port, rtg.hostname);

  redis.auth(rtg.auth.split(":")[1]);
} else {
    var redis = require("redis").createClient();
}*/

var express    = require('express');
var less       = require('express-less');
var session    = require('express-session');
var RedisStore = require('connect-redis')(session);
var initMongo  = require('./lib/init-mongo');
var initRoutes = require('./lib/init-routes');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

/* --- pipeline begins */
app.use(initMongo.connect);
app.use(initRoutes);
app.use(express.logger(':remote-addr -> :method :url [:status]'));
app.use(express.favicon());
app.use(express.static(__dirname + '/static'));
app.use('/less', less(__dirname + '/less'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
/*app.use(express.session({
  store : new RedisStore({host: 'localhost', port: 6379}),
  secret: 'change-this-to-a-super-secret-message',
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));*/

app.configure("development", function(){
  app.use(express.session({ secret: "password",
                            store: new RedisStore({ host: "127.0.0.1", port: "6379"}),
                            cookie: { maxAge: 24 * 60 * 60 * 1000 }
                          }));
}); 


app.configure("production", function(){
 var redisUrl = url.parse(process.env.REDISTOGO_URL);
 var redisAuth = redisUrl.auth.split(':');
 console.log("LOOK HERE" + redisUrl);
 console.log("LOOK HERE" + redisAuth);


 app.use(express.session({ secret: "password",
                           store: new RedisStore({host: redisUrl.hostname, port: redisUrl.port, db: redisAuth[0], pass: redisAuth[1]}),
                           cookie: { maxAge: 24 * 60 * 60 * 1000 }
         }));
});


app.use(app.router);
/* --- pipeline ends   */

var server = require('http').createServer(app);
server.listen(port, function(){
  console.log('Node server listening. Port: ' + port + ', Database: ' + dbname);
});

module.exports = app;
