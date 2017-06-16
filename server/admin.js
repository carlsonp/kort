require('mongoose').model('CardSortStudy');
require('mongoose').model('TreeTestStudy');
require('mongoose').model('ProductReactionStudy');

var mongoose = require('mongoose');
var CardSortStudy = mongoose.model('CardSortStudy');
var TreeTestStudy = mongoose.model('TreeTestStudy');
var ProductReactionStudy = mongoose.model('ProductReactionStudy');

module.exports = {
  CardSortAdmin: function (req, res, next) {
    CardSortStudy.find({}, function (err, docs) {
      if (err) {
        res.status(504);
        console.log("Error getting studies on admin page.");
        res.end(err);
      } else {
        res.render('cardsort_admin.ejs',{studies: docs});
      }
    });
  },
  TreeTestAdmin: function (req, res, next) {
    TreeTestStudy.find({}, function (err, docs) {
      if (err) {
        res.status(504);
        console.log("Error getting studies on admin page.");
        res.end(err);
      } else {
        res.render('treetest_admin.ejs',{studies: docs});
      }
    });
  },
  ProductReactionAdmin: function (req, res, next) {
    ProductReactionStudy.find({}, function (err, docs) {
      if (err) {
        res.status(504);
        console.log("Error getting studies on admin page.");
        res.end(err);
      } else {
        res.render('productreaction_admin.ejs',{studies: docs});
      }
    });
  }
}
