require('mongoose').model('TreeTestStudy');
var mongoose = require('mongoose');

var TreeTestStudy = mongoose.model('TreeTestStudy');

module.exports = {
    create_ajax: function (req, res) {
        var studyData = req.body;
        var newStudy = new TreeTestStudy({
            title: "Default Tree Test Title",
            type: "treetest",
            tasks: [],
            tree: [],
            active: false,
            ownerID: req.user._id
        });
        newStudy.save(function (err) {
            if (err) {
                console.log('treetest_server.js: Error creating new treetest.');
                res.status(504);
                res.end(err);
            } else {
                console.log('treetest_server.js: Created new treetest successfully.');
                res.send(newStudy);
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
                res.render('treetest/view.ejs',{singleStudy: docs});
            }
        });
    },
    edit: function (req, res, next) {
        TreeTestStudy.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, docs) {
            if (err) {
                res.status(504);
                console.log("cardsort_server.js: Error edit cardsort.");
                res.end(err);
            } else {
                res.render('treetest/edit.ejs',{singleStudy: docs, email: req.user.email});
            }
        });
    },
    results: function (req, res, next) {
        TreeTestStudy.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, docs) {
            if (err) {
                res.status(504);
                console.log("treetest_server.js: Error getting study to see results.");
                res.end(err);
            } else {
                res.render('treetest/results.ejs',{study: docs, email: req.user.email});
            }
        });
    },
    update: function (req, res, next) {
        var tasks = req.body.tasks.split(/\r?\n/).map(function(item) {
             return item.trim();
        }).filter(function(n){ return n != '' });
        var tree = req.body.tree.split(/\r?\n/).map(function(item) {
             return item.trim();
        }).filter(function(n){ return n != '' });
        TreeTestStudy.findOne({_id: req.body.id, ownerID: req.user._id},
            function (err, study) {
            if (err) {
                res.status(504);
                console.log('treetest_server.js: error updating treetest');
                res.end(err);
            } 
            else {
				study.title = req.body.title;
				study.tasks = tasks;
				study.tree = tree;
				study.active = req.body.active;
				
				study.save();
                res.redirect('/studies');
                res.end();   
            }
        });
    },
    delete: function(req, res, next) {
        TreeTestStudy.find({_id: req.params.id, ownerID: req.user._id}, function(err) {
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
                res.redirect('/studies');
                res.end();
            }
        });
    },
}
