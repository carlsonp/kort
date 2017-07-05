require('mongoose').model('User');
require('mongoose').model('CardSortStudy');
require('mongoose').model('ProductReactionStudy');
require('mongoose').model('TreeTestStudy');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var CardSortStudy = mongoose.model('CardSortStudy');
var ProductReactionStudy = mongoose.model('ProductReactionStudy');
var TreeTestStudy = mongoose.model('TreeTestStudy');


module.exports = {
	UserManagement: function (req, res, next) {
		User.find({}, function (err, docs) {
			if (err) {
                res.status(504);
                res.end(err);
            } else {
                res.render("usermanagement.ejs", {users: docs,
												email: req.user.email,
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
				console.log(err);
				req.end();
            } else {
				//delete all studies associated with this user
				CardSortStudy.remove({ownerID: user._id}, function(err) {
					if (err) {
						req.status(504);
						console.log(err);
						req.end();
					}
				});
				ProductReactionStudy.remove({ownerID: user._id}, function(err) {
					if (err) {
						req.status(504);
						console.log(err);
						req.end();
					}
				});
				TreeTestStudy.remove({ownerID: user._id}, function(err) {
					if (err) {
						req.status(504);
						console.log(err);
						req.end();
					}
				});
				
				//delete the user
				user.remove();
				
				res.redirect('/usermanagement');
                res.end();
			}
        });
    }
}

