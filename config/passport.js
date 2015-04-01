var LocalStrategy = require('passport-local').Strategy;
	// TwitterStrategy = require('passport-twitter').Strategy,
	// FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../userModel.js');

module.exports = function(passport){
	// serialize and deserialize the user
	passport.serializeUser(function(user, done) {
	    done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	    User.findById(id, function(err, user) {
	        done(err, user);
	    });
	});
	// adding strategies to passport

	passport.use(new LocalStrategy(
		{
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true 
		}, 
		function(req, email, password, done) {
			console.log('inside local strategy callback');
			process.nextTick(function() {
		        // check if a user is already logged in:
		        if (!req.user) {
		        	console.log('in auth passport callback');
		        	// see if a user exists with this email
		            User.findOne({ 'local.email' :  email }, function(err, user) {
		                // if there are any errors, return the error
		                if (err) return done(err);
		                if (user) {
		                	console.log("User found: ");
		                	console.log(user)
		                    return done(null, user);
		                } else {
		                	console.log("Making new user");
		                    var newUser = new User();
		                    newUser.local.password = newUser.makeHash(password);
		                    newUser.local.email = email;
		                    newUser.local.emailVerified = false;

		                    newUser.save(function(err, user) {
		                        if (err) return done(err);
		                        return done(null, user);
		                    });
		                }

		            });
		        } else {
		            // user already logged in
		            return done(null, req.user);
		        }
			});
		}
	));
}

// local signup
// see if we have the email address
	// yes
		//see if address is verified
			// yes - end
			// no - send response that email needs verification
	// no
		// hash the password
		// save user email and password to db
		// set emailVerified to false
		// create string for verification, save to db
		// send verification email
