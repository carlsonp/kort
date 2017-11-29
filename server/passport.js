require('mongoose').model('User');
var mongoose = require('mongoose');
var logger = require('./logger.js');

var LocalStrategy = require('passport-local').Strategy;

var User = mongoose.model('User');


module.exports = function(passport, flash) {
	// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {
			// find a user whose email is the same as the forms email
			// we are checking to see if the user trying to login already exists
			User.findOne({ 'email' :  email }, function(err, user) {
				// if there are any errors, return the error
				if (err)
					return done(err);
				// check to see if theres already a user with that email
				if (user) {
					return done(null, false, req.flash('createUserErrorMessage', 'Email is already taken.'));
				} else if (password.length < 1) {
					return done(null, false, req.flash('createUserErrorMessage', 'Password field is blank.'));
				} else if (email.length < 0) {
					return done(null, false, req.flash('createUserErrorMessage', 'Email field is blank.'));
				} else {
					// if there is no user with that email, create new user
					var newUser = new User();
					// set the user's local credentials
					newUser.email = email;
					newUser.password = newUser.generateHash(password);
					// save the user
					newUser.save(function(err) {
						if (err)
							throw err;
						return done(null, user, req.flash('createUserSuccessMessage', 'Account created successfully.'));
					});
				}
			});    
        });
    }));
	
	passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err){
				logger.error("passport.js: Error in passport user check:", err);
                return done(err);
            }
            // if no user is found, return the message
            if (!user || !user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Wrong email or password.')); // req.flash is the way to set flashdata using connect-flash
            }
            // all is well, return successful user
            return done(null, user);
        });
	}));
};
