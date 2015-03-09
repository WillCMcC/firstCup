// vars
var port = 6969;
	
//  reqs
var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
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

//Mongo Intialization
mongoose.connect('mongodb://localhost/firstCup');
var db = mongoose.connection;
db.on('error', function (err) {
	console.log('connection error', err);
});
db.once('open', function () {
	console.log('connected.');
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

// Schema to DB Model
var LinkModel = mongoose.model('LinkModel', linkSchema);

//save 
app.post('/linkSubmit', function(req, res){
	var submission = new LinkModel(req.body.submission);
	submission.save(function(err, data){
		if (err) console.log(err);
		console.log('Saved : ', data );
	})
})
app.get('/bro', function(request, response){
	// query db
	LinkModel.find(function(err, links){
		if (err) return console.log(error)
		console.log("You Win");
		response.send(links);
	});
})
