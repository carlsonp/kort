require('mongoose').model('Study');
require('mongoose').model('Response');
var mongoose = require('mongoose');
var Study = mongoose.model('Study');
var Response = mongoose.model('Response');
var resp = require('./response');

module.exports = {
    create_ajax: function (req, res) {
        var newStudy = new Study({
            title: "New Cardsort",
            type: "cardsort",
            data: {
                studyType: "open",
                cards: ['Apple','Orange','Banana','Pork','Beef','Chicken','Carrot','Broccoli','Peas'],
                groups: ['Fruit','Meat','Vegtables'],
            },
            responses: [],
            status: 'closed',
            ownerID: req.user._id
        });
        newStudy.save(function (err) {
            if (err) {
                console.log('cardsort_server.js: Error creating new cardsort via POST.');
                res.status(504);
                res.end(err);
            } else {
                console.log('cardsort_server.js: Created new cardsort via POST successfully.');
                res.send(newStudy);
                res.end();
            }
        });
    },
    view: function (req, res, next) {
        //create a response object
        var responseID;
        if (req.params.resid) {
            responseID = req.params.resid;
        } else {
            var response = resp.createResponse(req.params.id,"Anonymous");
            responseID = response._id;
        }
        
        Study.findOne({_id: req.params.id}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("cardsort_server.js: Error viewing cardsort.");
                res.end(err);
            } else {
                //add response id to study responses array
                study.responses.push(response);
                study.save();
                res.render('cardsort/view.ejs',{singleStudy: study, response: responseID });
            }
        });
    },

    edit: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, docs) {
            if (err) {
                res.status(504);
                console.log("cardsort_server.js: Error edit cardsort.");
                res.end(err);
            } else {
                res.render('cardsort/edit.ejs',{singleStudy: docs, email: req.user.email});
            }
        });
    },
    results: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("cardsort_server.js: Error getting study to see results.");
                res.end(err);
            } else {
				//results matrix for heatmap
				var matrix = new Array(study.data.groups.length);
				for (var i = 0; i < study.data.groups.length; i++) {
					matrix[i] = new Array(study.data.cards.length);
					matrix[i].fill(0);
				}
                for (var i = 0; i < study.responses.length; i++) {
                    var response = study.responses[i].data;
                    
                    //remove date (first item)
                    response.shift(); 
                    response.forEach(function(pair){
                        var groupIndex = study.data.groups.indexOf(pair.groupname);
                        var cardIndex = study.data.cards.indexOf(pair.cardname);
                        matrix[groupIndex][cardIndex]+=1;
                    });
                }
				res.render('cardsort/results.ejs',{study: study, matrix: matrix, email: req.user.email});
            }
        });
    },
    update: function (req, res, next) {
        var cards = req.body.cards.split(/\r?\n/).map(function(item) {
             return item.trim();
        }).filter(function(n){ return n != '' });
        var groups = req.body.groups.split(/\r?\n/).map(function(item) {
             return item.trim();
        }).filter(function(n){ return n != '' });
        Study.findOne({ _id: req.body.id, ownerID: req.user._id},
            function (err, study) {
            if (err) {
                res.status(504);
                console.log('cardsort_server.js: error updating cardsort');
                res.end(err);
            } 
            else {
				study.title = req.body.title;
                study.data = {
                    studyType: req.body.studyType,
                    cards: cards,
                    groups: groups,
                }
				study.status = req.body.status;
				study.save();
                res.redirect('/studies');
                res.end();   
            }
        });
    },   
}
