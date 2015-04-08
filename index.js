// vars
var port = process.env.PORT || 6969;
	
//  reqs
var http = require("http"),
	express = require("express"),
	bodyParser = require("body-parser"),
	parseurl = require("parseurl")
	bcrypt = require("bcrypt")
	mongoose = require("mongoose"),
	passport = require("passport"),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	db = require("./config/db.js");


var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// var util = require('./public/utility.js');
// var expressJwt = require('express-jwt');
// var url = require("url");
// var passport = require('passport');
// var jwt = require('jsonwebtoken');
// var expressSession = require('express-session');
// var MongoStore = require('connect-mongo')(expressSession);

// //Serving Static Files
// app.use(function(req, res, next) {  
//     res.header('Access-Control-Allow-Origin', 'http://localhost:6969');
//     next();
// });


//Mongo Intialization

mongoose.connect(db.urlLocal); // connect to our database
var db = mongoose.connection;
db.on('error', function (err) {
	console.log('connection error', err);
});
db.once('open', function () {
	console.log('mongo connected...');
});


require('./config/passport.js')(passport);


app.use(session({ secret: 'mysecret' }));
app.use(passport.initialize());
app.use(passport.session());

// logging all requests to console
app.use(function(req,res,next){
	console.log('serving '+req.method+' route '+req.url);
	console.log(req.user ? req.user : "no user");
	next();
});
require("./config/routes.js")(app, passport)

app.listen(port, function(){
	console.log('Listening on port ' + port);
});
