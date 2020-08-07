require('mongoose').model('User');
var mongoose = require('mongoose');
var logger = require('./logger.js');

var User = mongoose.model('User');

module.exports = function(adminEmail, adminPassword) {
	var admin_user = new User();
	admin_user.email = adminEmail;
	admin_user.password = admin_user.generateHash(adminPassword);
	admin_user.type = "local";
	admin_user.admin = true;

	User.findOne({ 'email' :  adminEmail }, function(err, user) {
		// if there are any errors, return the error
		if (err) {
			logger.error("creatadmin_user.js: Error running find query:", err);
			return done(err);
		}

		// check to see if there's already a user with that email
		if (!user) {
			// save the user
			admin_user.save(function(err) {
				if (err)
					throw err;
				logger.info("createadmin_user.js: Default admin user created.");
			});
		}
	});
}
