require('mongoose').model('Study');
var mongoose = require('mongoose');
var Study = mongoose.model('Study');
var Response = mongoose.model('Response');
var resp = require('./response_server');

module.exports = {
    create_ajax: function (req, res) {
        var studyData = req.body;
        var newStudy = new Study({
            title: "Default Tree Test Title",
            type: "Tree Test",
            data: {
                showSiblings: true,
                selectableParents: true,
                tasks: ['Where is the Apple?','Where is the Steak','Where is the Wine?'],
                tree: ['Food', 'Food/Meat', 'Food/Meat/Steak', 'Food/Meat/Chicken', 'Food/Meat/Pork', 'Food/Fruit', 'Food/Fruit/Apple', 'Food/Fruit/Banana', 'Food/Fruit/Orange', 'Food/Fruit/Lime', 'Food/Fruit/Grapefruit', 'Drink','Drink/Non-alcoholic', 'Drink/Non-alcoholic/Milk', 'Drink/Non-alcoholic/Water', 'Drink/Non-alcoholic/Juice', 'Drink/Alcohol', 'Drink/Alcohol/Beer', 'Drink/Alcohol/Wine'],
            },
            status: 'closed',
            ownerID: req.user._id,
            private: false,
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
    edit: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("cardsort_server.js: Error edit cardsort.");
                res.end(err);
            } else {
                res.render('treetest/edit.ejs',{singleStudy: study, email: req.user.email});
            }
        });
    },
    results: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("treetest_server.js: Error getting study to see results.");
                res.end(err);
            } else {
                for (var i = 0; i < study.completeResponses.length; i++) {
                    var response = study.responses[i].data;
                }
                res.render('treetest/results.ejs',{study: study, email: req.user.email});
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
        Study.findOne({_id: req.body.id, ownerID: req.user._id},
            function (err, study) {
            if (err) {
                res.status(504);
                console.log('treetest_server.js: error updating treetest');
                res.end(err);
            } 
            else {
				study.title = req.body.title;
                study.data = {
                    tasks: tasks,
                    tree: tree,
                    selectableParents: req.body.selectableParents,
                    showSiblings: req.body.showSiblings,
                }
				study.status = req.body.status;
                study.private = req.body.private;
				study.save();
                res.redirect('/studies');
                res.end();   
            }
        });
    },
}
