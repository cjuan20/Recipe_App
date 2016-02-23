//Requirements
var User = require('../models/users');
var LocalStrategy   = require('passport-local').Strategy;
var passport = require('passport');

module.exports = function(passport) {
	console.log('PASSPORT INVOKED');

	//Serialize user
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	//Deserialize user 
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
  });

	//SIGNUP
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, done) {

    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
		User.findOne({ 'email': email }, function(err, user) {
			if (err) { 
				return done(err) }
			if (user) { 
				return done(null, false); 
			} else {
				var newUser = new User();
				newUser.email = email;
				newUser.password = newUser.generateHash(password);
				newUser.username = req.body.username;

				newUser.save(function(err) {
					if (err) { 
						console.log(err)
						throw err
					} else {
						return done(null, newUser);
					}
				}); // end user save
			}; // end user check exists
		}); // end find user
	})); // end passport local signup



	//LOGIN
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, 
	function(req, email, password, done) {

	  // find a user whose email is the same as the forms email
		// we are checking to see if the user trying to login already exists
		User.findOne({ 'email': email }, function(err, user) {
			if (err) { return done(err) }

			if (!user) {
				console.log('NO USER FOUND');
				return done(null, false);
			}

			if (!user.validPassword(password)) {
				return done(null, false);
			}
			req.session.user = user;
			return done(null, user);
		}); // end find user
	})); // end passport local login


}; // end module


