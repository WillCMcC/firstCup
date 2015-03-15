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
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
// var expressSession = require('express-session');
var mongoose = require("mongoose");
// var MongoStore = require('connect-mongo')(expressSession);
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



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


//Mongo Intialization
mongoose.connect('mongodb://localhost/firstCup');
var db = mongoose.connection;
db.on('error', function (err) {
	console.log('connection error', err);
});
db.once('open', function () {
	console.log('mongo connected...');
});

// app.use(expressSession({
// 	secret: 'secrettt',
//     store: new MongoStore({ mongooseConnection: mongoose.connection })
// }));

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
	password: String,
	firstName: String,
	lastName: String
})

// Schema to DB Model
var LinkModel = mongoose.model('LinkModel', linkSchema);
var UserModel = mongoose.model('User', userSchema)

// middleware
var secret = "mmmsecret";
app.use('/linkSubmit', expressJwt({secret: secret}));


//endpoints 

app.post('/linkSubmit', function(req, res){
	var submission = new LinkModel(req.body.submission);
	console.log('linksubmit')
	// user = req.session.user;
	// if(user){
	// 	submission.user = session.user.username;
	// 	submission.postedBy = session.user.username;
	// };
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
			var user = req.body.user;
			bcrypt.genSalt(10, function(err, salt) {
				if(err) console.log(err);
				bcrypt.hash(req.body.user.password, salt, function(err, hash){
					if(err) console.log(err);
					console.log("check here 112")
					console.log(user)
					user.password = hash;
					console.log(user);
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
			bcrypt.compare(req.body.user.password, data[0].password, function(err, valid){
				if( err ) console.log(err);
				if(valid){
	
					var profile = {
						firstName: data[0].firstName,
						lastName: data[0].lastName,
						_id: data[0]._id
					}
					var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });

					res.json({ token: token });
					console.log(token)
					console.log("^ shouldb be signed in");
					// res.status(201).end();
				}
			})
		} else {
			// no user
			console.log("cant find user")
		}
	})
})

app.get('/bro',function(request, response){
	// query db for all links
	LinkModel.find(function(err, links){
		if (err) return console.log(err)
		response.status(200).send(links);
	});
})

app.get('/logout', function(req, res){
    // delete $window.sessionStorage.token;
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
	if(req.user){
		console.log('authenticated')
		next()
	}
	res.status(400).end("not authenticated");
}
