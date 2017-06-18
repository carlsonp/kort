require('mongoose').model('CardSortStudy');
require('mongoose').model('TreeTestStudy');
require('mongoose').model('ProductReactionStudy');
require('mongoose').model('User');

var mongoose = require('mongoose');
var async = require('async');
var CardSortStudy = mongoose.model('CardSortStudy');
var TreeTestStudy = mongoose.model('TreeTestStudy');
var ProductReactionStudy = mongoose.model('ProductReactionStudy');
var User = mongoose.model('User');

module.exports = {
  Studies: function (req, res, next) {
      var cardsortQuery = CardSortStudy.find({});
      var treetestQuery = TreeTestStudy.find({});
      var productreactionQuery = ProductReactionStudy.find({});

      var resources = {
        cardsorts: cardsortQuery.exec.bind(cardsortQuery),
        treetests: treetestQuery.exec.bind(treetestQuery),
        productreactions: treetestQuery.exec.bind(productreactionQuery),
      };

      async.parallel(resources, function (err, results) {
        if (err) {
          res.status(500)
          return;
        }
        res.render("studies.ejs", {studies: results});
      });
    },
	UserManagement: function (req, res, next) {
		User.find({}, function (err, docs) {
			if (err) {
                res.status(504);
                res.end(err);
            } else {
                res.render("usermanagement.ejs", {users: docs});
            }
      });
	}
}

