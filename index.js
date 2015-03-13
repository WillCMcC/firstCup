// vars
var port = 6969;
	
//  reqs
var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var url = require("url");
// var passport = require('passport');
var expressSession = require('express-session');
var mongoose = require("mongoose");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressSession({secret:"secretverysecret"}));


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

//endpoints 
app.get('/api/users', function(req,res){
	console.log("user",req.query)

	var user = new UserModel(req.query);

	UserModel.find(user, function(error, results){
		if(error) console.log(error);
		console.log("inside db callback")
		console.log(results.length);
		if(results.length === 0){
			console.log('saving...')
			user.save(function(err, data){
				console.log('saved',data)
			})
		}
	});


})

app.post('/linkSubmit', function(req, res){
	var submission = new LinkModel(req.body.submission);
	console.log('linksubmit')
	session = req.session;
	if(session.user){
		submission.user = session.user.username;
		submission.postedBy = session.user.username;
	};
	submission.save(function(err, data){
		console.log('in linkSubmit callback');
		if (err) console.log(err);
		console.log('Saved : ', data );
	})
})
app.get('/bro', function(request, response){
	// query db
	LinkModel.find(function(err, links){
		if (err) return console.log(error)
		response.send(links);
	});
})

app.delete('/deleteLInk', function(req, res){
	// get id from url query
	var link = { _id: req.query._id }; 
	LinkModel.find(link)
		.remove( function(err, results){
			console.log('inside remove callback');
		});
	});
