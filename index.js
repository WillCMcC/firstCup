// vars
var port = 6969;
	
//  reqs
var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var parseurl = require("parseurl")
var url = require("url");
var util = require('./public/utility.js');
var bcrypt = require("bcrypt")
// var passport = require('passport');
var expressSession = require('express-session');
var mongoose = require("mongoose");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressSession({
	secret:"secretverysecret",
	resave: false,
	saveUninitialized: true
}));


//Server
var server = http.createServer(app);


server.listen(port, function(){
	console.log('Listening on port ' + port);
});

//Serving Static Files
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {  
    res.header('Access-Control-Allow-Origin', 'http://localhost:6969');
    next();
});


//setting the session
var session;

// app.use('/', function(req, res, next){
// 	session = req.session;
// 	session.user = "lima";
// 	next();
// })



//Mongo Intialization
mongoose.connect('mongodb://localhost/firstCup');
var db = mongoose.connection;
db.on('error', function (err) {
	console.log('connection error', err);
});
db.once('open', function () {
	console.log('mongo connected...');
});

//Define Schema
var linkSchema = new mongoose.Schema({
	url : String,
	cups : Number,
	title : String,
	postedBy : String,
	viewedBy : Array,
	description : String,
	submissionTime: { type : Date, default: Date.now },
});

var userSchema = new mongoose.Schema({
	username: String,
	password: String
})

// Schema to DB Model
var LinkModel = mongoose.model('LinkModel', linkSchema);
var UserModel = mongoose.model('User', userSchema)

//middleware
// app.use('/linkSubmit', function(req, res, next){
// 	console.log('middleware')
// 	console.log(req.session)
// 	if(req.session.user){
// 		console.log(req.session.user)
// 		next()
// 	} else {
// 		res.send({response: "You must be logged in"})
// 	}
// });

app.use(function (req, res, next) {
  var views = req.session.views

  if (!views) {
    views = req.session.views = {}
  }

  // get the url pathname
  var pathname = parseurl(req).pathname

  // count the views
  views[pathname] = (views[pathname] || 0) + 1

  next()
})

//endpoints 

app.post('/linkSubmit', ensureAuthenticated, function(req, res){
	var submission = new LinkModel(req.body.submission);
	console.log('linksubmit')
	user = req.session.user;
	if(user){
		submission.user = session.user.username;
		submission.postedBy = session.user.username;
	};
	submission.save(function(err, data){
		console.log('in linkSubmit callback');
		if (err) console.log(err);
		console.log('Saved : ', data );
		res.status(201).end();
	})
})

app.post('/api/users/signup', function(req,res){
// checks if a user exists, then adds a new user
	UserModel.find({username: req.body.user.username}, function(err, data){
		if(data.length > 0){
			console.log("already a user")
			res.redirect('/');
		} else {
			var user = {
				username: req.body.user.username
			}
			bcrypt.genSalt(10, function(err, salt) {
				if(err) console.log(err);
				bcrypt.hash(req.body.user.password, salt, function(err, hash){
					if(err) console.log(err);
					user.password = hash;
					var userModel = new UserModel(user);
					userModel.save(function(err, data){
						res.status(201).send(data);
					})
				})
			});
		}
	})
})
app.post('/api/users/signin', function(req,res){

// checks if a user exists, then adds a new user
	UserModel.find({username: req.body.user.username}, function(err, data){
		if(data.length > 0){
			console.log("already a user")
			bcrypt.compare(req.body.user.password, data[0].password, function(err, bool){
				if( err ) console.log(err);
				if(bool){
					// sign in!
					util.createSession(req, res, {_id: data[0]._id}, function(req, res){
						console.log('signin route', req.session.user)
						res.redirect('/#/main');
					});
				}
			})
		} else {
			// no user
			console.log("cant find user")
		}
	})
})

app.get('/bro',function(request, response){
	// query db
	session = request.session;
	console.log(request.session)
	LinkModel.find(function(err, links){
		if (err) return console.log(err)
		response.send(links);
	});
})

app.get('/logout', function(req, res){
	req.session.destroy();
	res.redirect('/#/main')
})

app.delete('/deleteLInk', function(req, res){
	// get id from url query
	var link = { _id: req.query._id }; 
	LinkModel.find(link)
		.remove( function(err, results){
			console.log('inside remove callback');
		});
	});

function ensureAuthenticated(req, res, next){
	console.log('ensure...', req.session.user)
	if(req.session.user){
		console.log('authenticated')
		next()
	}
	res.status(400).end("not authenticated");
}
