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
                res.render("usermanagement.ejs", {users: docs});
            }
      });
	},
	
	deleteUser: function(req, res, next) {
		console.log("top of method");
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

