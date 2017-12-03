require('mongoose').model('User');
require('mongoose').model('Study');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Study = mongoose.model('Study');
var logger = require('./logger.js');

module.exports = {
	UserManagement: function (req, res, next) {
		User.find({}, function (err, docs) {
			if (err) {
                res.status(504);
				logger.error('user_server.js: UserManagement error, 504.');
                res.end(err);
            } else {
                res.render("users.ejs", {users: docs,
										email: req.user.email,
										admin: req.session.admin,
                                        createUserErrorMessage: req.flash('createUserErrorMessage'), 
                                        createUserSuccessMessage: req.flash('createUserSuccessMessage')});
            }
      });
	},
	
	deleteUser: function(req, res, next) {
		//TODO: use MongoStore.destroy(id) to remove the session from the database
        User.findById(req.params.id, function(err, user) {
            if (err) {
                req.status(504);
                logger.error('user_server.js: deleteUser error, 504: ', err);
				req.end();
            } else {
				//delete all studies associated with this user
				Study.remove({ownerID: user._id}, function(err) {
					if (err) {
						req.status(504);
						logger.error('user_server.js: deleteUser error, 504: ', err);
						req.end();
					}
				});
				//delete the user
				user.remove();
				logger.info('User deleted');
				res.redirect('/users');
                res.end();
			}
        });
    },
    resetPassword: function(req, res, next) {
        User.findById( {_id: req.body.userid}, function(err, user) {
            if (err) {
                req.status(504);
				logger.error('user_server.js: resetPassword error, 504: ', err);
				req.end();
            } else {
				user.password = user.generateHash(req.body.password);
				user.save();
				logger.info('Password reset.');
				res.redirect('/users');
                res.end();
			}
        });
    },
    grantadmin: function(req, res, next) {
        User.findOneAndUpdate({ "_id": req.params.id }, 
            { "$set": { "admin": true }
            }).exec(function(err, book){
               if(err) {
                   console.log(err);
                   res.status(500).send(err);
               } else {
               	res.redirect('/users');
               	res.end();
               }
        });
    },
    revokeadmin: function(req, res, next) {
        User.findOneAndUpdate({ "_id": req.params.id }, 
            { "$set": { "admin": false }
            }).exec(function(err, book){
               if(err) {
                   console.log(err);
                   res.status(500).send(err);
               } else {
               	res.redirect('/users');
               	res.end();
               }
        });
    },
}

