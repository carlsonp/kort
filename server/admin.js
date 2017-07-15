// require('mongoose').model('CardSortStudy');
// require('mongoose').model('TreeTestStudy');
// require('mongoose').model('ProductReactionStudy');
require('mongoose').model('Study');

var mongoose = require('mongoose');
// var async = require('async');
// var CardSortStudy = mongoose.model('CardSortStudy');
// var TreeTestStudy = mongoose.model('TreeTestStudy');
// var ProductReactionStudy = mongoose.model('ProductReactionStudy');
var Study = mongoose.model('Study');

module.exports = {
    Studies: function (req, res, next) {
        Study.find({}, function (err, docs) {
            if (err) {
                res.status(504);
                console.log("admin.js: Error edit cardsort.");
                res.end(err);
            } else {
                res.render("studies.ejs", {studies: docs, email: req.user.email});
            }
        });
    },
    delete: function(req, res, next) {
        Study.findOne({ _id: req.params.id, ownerID: req.user._id}, function(err) {
            if (err) {
                req.status(504);
                console.log("admin.js: Cannot find study to delete:" + req.params.id);
                console.log(err);
                req.end();
            }
        }).remove(function (err) {
            if (err) {
                console.log(err);
                res.end(err);            
            } else {
                res.redirect('/studies');
                res.end();
            }
        });
    },
    submitResult: function (req, res, next) {
        Study.findOne({ _id: req.body.id}, 
            function (err, study) {
                if (err) {
                    res.status(504);
                    console.log('cardsort_server.js: error submitting result');
                    res.end(err);
                } 
                else {
                    study.responses.push(JSON.parse(req.body.result));
                    study.save();
                    res.redirect('/studies');
                    res.end();   
                }
        });
    },
	// Studies: function (req, res, next) {
 //      var studyQuery = Study.find({ownerID: req.user._id});
 //      var cardsortQuery = CardSortStudy.find({ownerID: req.user._id});
 //      var treetestQuery = TreeTestStudy.find({ownerID: req.user._id});
 //      var productreactionQuery = ProductReactionStudy.find({ownerID: req.user._id});

 //      var resources = {
 //        studies: studyQuery.exec.bind(studyQuery),
 //        cardsorts: cardsortQuery.exec.bind(cardsortQuery),
 //        treetests: treetestQuery.exec.bind(treetestQuery),
 //        productreactions: treetestQuery.exec.bind(productreactionQuery),
 //      };

 //      async.parallel(resources, function (err, results) {
 //        if (err) {
 //          res.status(500)
 //          return;
 //        }
 //        res.render("studies.ejs", {studies: results, email: req.user.email});
 //      });
 //    },
}

