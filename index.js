// vars
var port = 6969;
	
//  reqs
var http = require("http");
var express = require("express");
var mongoose = require("mongoose");
var app = express();
var url = require("url");

mongoose.connect('mongodb://localhost/firstCup');

app.use(express.static(__dirname + '/public'));

//server
// function requestListener(request,response){
// 	console.log('bro' + port)
// } 
var server = http.createServer(app);

app.get('/bro', function(request, response){
	console.log(request.url);
})



// var server = require("http").createServer(app);

server.listen(port, function(){
	console.log('Listening on port ' + port);
});