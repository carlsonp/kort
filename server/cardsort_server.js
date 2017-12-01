require('mongoose').model('Study');
require('mongoose').model('Response');
var mongoose = require('mongoose');
var Study = mongoose.model('Study');
var Response = mongoose.model('Response');
var resp = require('./response_server');
var logger = require('./logger.js');

module.exports = {
     create: function (req, res) {
        var newStudy = new Study({
            title: "New Card Sort",
            type: "cardsort",
            dateCreated: new Date(Date.now()),
            data: {
                studyType: "open",
                cards: ['Apple','Orange','Banana','Pork','Beef','Chicken','Carrot','Broccoli','Peas'],
                groups: ['Fruit','Meat','Vegetables'],
            },
            status: 'closed',
            ownerID: req.user._id,
            private: false,
        });
        newStudy.save(function (err) {
            if (err) {
                logger.error('cardsort_server.js: Error creating new cardsort via POST:', err);
                res.status(504);
                res.end(err);
            } else {
                logger.info('cardsort_server.js: Created new cardsort via POST successfully.');
                res.redirect('/studies/new');
                res.end();
            }
        });
    },
    edit: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, docs) {
            if (err) {
                res.status(504);
                logger.error("cardsort_server.js: Error in edit cardsort:", err);
                res.end(err);
            } else {
                var fullUrl = req.protocol + '://' + req.get('host');
                res.render('cardsort/edit.ejs',{singleStudy: docs, email: req.user.email, url: fullUrl});
            }
        });
    },
    results: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, study) {
            if (err) {
                res.status(504);
                logger.error("cardsort_server.js: Error getting study to see results:", err);
                res.end(err);
            } else {
				//collect all group names
                sum_groups = []
                for (var i = 0; i < study.completeResponses.length; i++) {
                    if (study.completeResponses[i].complete == true){
                        var response = study.completeResponses[i].data;
                        for (var j = 0; j < response.length; j++) {
							if(sum_groups.indexOf(response[j].groupname) == -1){
								sum_groups.push(response[j].groupname);
							}
                        }
                    }
                }

				var matrix = new Array(study.data.cards.length);
				for (var i = 0; i < study.data.cards.length; i++) {
					matrix[i] = new Array(sum_groups.length);
					matrix[i].fill(0);
				}

                for (var i = 0; i < study.completeResponses.length; i++) {
                    if (study.completeResponses[i].complete == true){
                        var response = study.completeResponses[i].data;
                        for (var j = 0; j < response.length; j++) {
							var groupIndex = sum_groups.indexOf(response[j].groupname);
                            for (var k = 0; k < response[j].cards.length; k++) {
                                var cardIndex = study.data.cards.indexOf(response[j].cards[k]);
                                matrix[cardIndex][groupIndex]+=1;
                            }
                        }
                    }
                }
				res.render('cardsort/results.ejs',{groups: sum_groups, cards: study.data.cards, study: study, matrix: matrix,email: req.user.email});
            }
        });
    },
    update: function (req, res, next) {

        Study.findOne({ _id: req.body.id, ownerID: req.user._id},
            function (err, study) {
            if (err) {
                res.status(504);
                logger.error('cardsort_server.js: error updating cardsort:', err);
                res.end(err);
            }
            else {
				study.title = req.body.title;
                study.data = {
                    studyType: req.body.studyType,
                    cards: JSON.parse(req.body.cards),
                    groups: JSON.parse(req.body.groups),
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
