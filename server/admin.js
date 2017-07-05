require('mongoose').model('CardSortStudy');
require('mongoose').model('TreeTestStudy');
require('mongoose').model('ProductReactionStudy');

var mongoose = require('mongoose');
var async = require('async');
var CardSortStudy = mongoose.model('CardSortStudy');
var TreeTestStudy = mongoose.model('TreeTestStudy');
var ProductReactionStudy = mongoose.model('ProductReactionStudy');

module.exports = {
	Studies: function (req, res, next) {
      var cardsortQuery = CardSortStudy.find({ownerID: req.user._id});
      var treetestQuery = TreeTestStudy.find({ownerID: req.user._id});
      var productreactionQuery = ProductReactionStudy.find({ownerID: req.user._id});

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
        res.render("studies.ejs", {studies: results, email: req.user.email});
      });
    },
}

