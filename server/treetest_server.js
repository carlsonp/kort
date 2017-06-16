require('mongoose').model('CardSortStudy');
var mongoose = require('mongoose');

var TreeTestStudy = mongoose.model('TreeTestStudy');

module.exports = {
    create: function (req, res) {
        var studyData = req.body;
      	var newStudy = new TreeTestStudy({
            title: "Default Tree Test Title",
            type: "treetest",
        });
    	newStudy.save(function (err) {
        	if (err) {
        		console.log('treetest_server.js: Error creating new treetest.');
        		res.status(504);
        		res.end(err);
        	} else {
        		console.log('treetest_server.js: Created new treetest successfully.');
        		res.redirect('/admin/all');
        		res.end();
        	}
        });
    },
    view: function (req, res, next) {
        TreeTestStudy.findOne({_id: req.params.id}, function (err, docs) {
            if (err) {
                res.status(504);
                console.log("treetest_server.js: Error viewing treetest.");
                res.end(err);
            } else {
                res.render('treetest.ejs',{singleStudy: docs});
            }
        });
    },
    results: function (req, res, next) {
        TreeTestStudy.findOne({_id: req.params.id}, function (err, docs) {
            if (err) {
                res.status(504);
                console.log("treetest_server.js: Error getting study to see results.");
                res.end(err);
            } else {
                res.render('treetest_results.ejs',{study: docs});
            }
        });
    },
    update: function (req, res, next) {
        CardSortStudy.findByIdAndUpdate(
            { _id: req.body.id}, 
            {title: req.body.title,
             // studyType: req.body.studyType,
            }, 
            function (err, docs) {
            if (err) {
                res.status(504);
                console.log('treetest_server.js: error updating treetest');
                res.end(err);
            } 
            else {
                res.redirect('/admin/all');
                res.end();   
            }
        });
    },
    delete: function(req, res, next) {
        TreeTestStudy.find({ _id: req.params.id}, function(err) {
            if (err) {
                req.status(504);
        		console.log("treetest_server.js: Cannot find study to delete:" + req.params.id);
        		console.log(err);
                req.end();
            }
        }).remove(function (err) {
            if (err) {
                console.log(err);
                res.end(err);            
            } else {
                res.redirect('/admin/all');
                res.end();
            }
        });
    },
}
