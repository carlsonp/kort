require('mongoose').model('User');
var mongoose = require('mongoose');
var logger = require('./logger.js');

var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


var User = mongoose.model('User');


module.exports = function(passport, flash, googleClientID, googleClientSecret, googleCallbackURL) {
	
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
				if (err) {
					logger.error("passport.js: Error in local strategy on user lookup:", err);
					return done(err);
				}
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
					newUser.type = "local";
					// save the user
					newUser.save(function(err) {
						if (err) {
							logger.error("passport.js: Error in local strategy on user save:", err);
							throw err;
						}
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
        User.findOne({ 'email' :  email, 'type' : 'local' }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err){
				logger.error("passport.js: Error in local passport user check:", err);
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
	
	
	//https://scotch.io/tutorials/easy-node-authentication-google
	passport.use('google', new GoogleStrategy({
        clientID        : googleClientID,
        clientSecret    : googleClientSecret,
        callbackURL     : googleCallbackURL,
    },
    function(token, refreshToken, profile, done) {

        // asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user by email
            // TODO: Google accounts can have multiple email addresses, do we need additional checking here?
            User.findOne({ 'email' : profile.emails[0].value, 'type': 'Google' }, function(err, user) {
                if (err) {
					logger.error("passport.js: Error in Google strategy on user lookup:", err);
                    return done(err);
				}

                if (user) {
					// an existing Google user is found, log them in
					return done(null, user);
                } else {
                    // if the user is not in the database, create a new user
                    var newUser = new User();

                    // set all of the relevant information
                    newUser.token = token;
                    newUser.name = profile.displayName;
                    newUser.email = profile.emails[0].value; // pull the first email
                    newUser.type = 'Google';

                    // save the user
                    newUser.save(function(err) {
                        if (err) {
							logger.error("passport.js: Error in Google strategy on user save:", err);
                            throw err;
						}
						logger.info("passport.js: Google account merged in and created successfully for:", newUser.email);
                        return done(null, newUser);
                    });
                }
            });
        });

    }));
};
