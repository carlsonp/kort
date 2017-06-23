require('mongoose').model('User');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {
	UserManagement: function (req, res, next) {
		User.find({}, function (err, docs) {
			if (err) {
                res.status(504);
                res.end(err);
            } else {
                res.render("usermanagement.ejs", {users: docs, createUserErrorMessage: req.flash('createUserErrorMessage'), createUserSuccessMessage: req.flash('createUserSuccessMessage')});
            }
      });
	},
	
	deleteUser: function(req, res, next) {
		//TODO: use MongoStore.destroy(id) to remove the session from the database
        User.findOneAndRemove({_id: req.params.id}, function(err) {
            if (err) {
                req.status(504);
				console.log(err);
				req.end();
            } else {
				res.redirect('/usermanagement');
                res.end();
			}
        });
    },
}

