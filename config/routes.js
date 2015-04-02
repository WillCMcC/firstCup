//endpoints 
var User = require('../models/userModel.js');
var Link = require('../models/linkModel.js');

module.exports = function(app, passport){
	app.get('/auth', ensureAuthenticated, function(req,res){
		res.send("You are authenticated! <br/>" + req.user)
	})
	app.post('/linkSubmit', function(req, res){
		var submission = new Link(req.body.submission);
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
	app.post('/signup',	passport.authenticate('local', {
		successRedirect: '/pending',
		failureRedirect: '/notAuthorized'
	}));
	app.post('/login', passport.authenticate('local', {
		successRedirect: "/",
		failureRedirect: "login"
	}))
	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});

	// app.post('/api/users/signup', function(req,res){
	// 	console.log('in the route yup')
	// 	// checks if a user exists, then adds a new user
	// 	UserModel.find({username: req.body.user.username}, function(err, data){
	// 		if(err) console.log(err);
	// 		if(data.length > 0){
	// 			console.log("already a user")
	// 			res.redirect('/');
	// 		} else {
	// 			console.log('not a user yet')
	// 			var user = req.body.user;
	// 			bcrypt.genSalt(10, function(err, salt) {
	// 				if(err) console.log(err);
	// 				bcrypt.hash(req.body.user.password, salt, function(err, hash){
	// 					if(err) console.log(err);
	// 					console.log("check here 112")
	// 					console.log(user)
	// 					var profile = {
	// 						firstName: user.firstName,
	// 						lastName: user.lastName,
	// 						username: user.username,
	// 						password: hash,
	// 					}
	// 					var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });
	// 					profile.token = token;
	// 					console.log(profile);
	// 					var userModel = new UserModel(profile);
	// 					userModel.save(function(err, data){
	// 						if(err) console.log(err);
	// 						res.status(201).send(data);
	// 					})
	// 				})
	// 			});
	// 		}
	// 	})
	// })
	// app.post('/api/users/signin', function(req,res){

	// 	// checks if a user exists, then adds a new user
	// 	UserModel.find({username: req.body.user.username}, function(err, data){
	// 		if(data.length > 0){
	// 			var user = data[0];
	// 			console.log("User found")
	// 			// username found, check password
	// 			bcrypt.compare(req.body.user.password, user.password, function(err, valid){
	// 				if( err ) console.log(err);
	// 				if(valid){
	// 					//password correct, create token
	// 					var profile = {
	// 						firstName: user.firstName,
	// 						lastName: user.lastName,
	// 						username: user.username,
	// 						_id: user._id,
	// 					}
	// 					var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });

	// 					UserModel.findOne(user, function(err, data){
	// 						data.token = token;
	// 						console.log('saved data', data)
	// 						data.save(function(err, saved){
	// 							res.json(saved)
	// 						})
	// 					}); 
	// 				} else {
	// 					//not valid
	// 					res.end("Wrong password")
	// 				}
	// 			})
	// 		} else {
	// 			// no user
	// 			console.log("cant find user")
	// 		}
	// 	})
	// })

	// app.get('/getUser', function(req, res){
	// 	var token = req.query.token;
	// 	UserModel.find({token: token}, function(err, data){
	// 		if(err) {
	// 			console.log(err);
	// 			res.end(401);
	// 		}
	// 		console.log('got user!')
	// 		res.json(data[0])
	// 	})
	// })

	app.get('/bro',function(request, response){
		// query db for all links
		Link.find(function(err, links){
			if (err) return console.log(err)
			response.status(200).send(links);
		});
	})

	app.delete('/deleteLInk', function(req, res){
		// get id from url query
		var link = { _id: req.query._id }; 
		Link.find(link)
			.remove( function(err, results){
				console.log('inside remove callback');
			});
		});
}

function ensureAuthenticated(req, res, next){
	if(req.user){
		console.log('authenticated')
		next()
	}
	res.status(400).end("not authenticated");
}