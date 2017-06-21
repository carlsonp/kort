require('mongoose').model('User');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = {
	deleteUser: function(req, res, next) {
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

