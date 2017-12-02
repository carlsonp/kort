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
            title: "New Net Promoter Score",
            type: "nps",
            dateCreated: new Date(Date.now()),
            data: {
                
            },
            status: 'closed',
            ownerID: req.user._id,
            private: false,
        });
        newStudy.save(function (err) {
            if (err) {
                logger.error('nps_server.js: Error creating new NPS test via POST:', err);
                res.status(504);
                res.end(err);
            } else {
                logger.info('nps_server.js: Created new NPS test via POST successfully.');
                res.redirect('/studies/new');
                res.end();
            }
        });
    },
    edit: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, docs) {
            if (err) {
                res.status(504);
                logger.error("nps_server.js: Error in edit NPS:", err);
                res.end(err);
            } else {
                var fullUrl = req.protocol + '://' + req.get('host');
                res.render('nps/edit.ejs', {singleStudy: docs, email: req.user.email, admin: req.session.admin, url: fullUrl});
            }
        });
    },
    results: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, study) {
            if (err) {
                res.status(504);
                logger.error("nps_server.js: Error getting NPS study to see results:", err);
                res.end(err);
            } else {

                Response.find({_id: {$in: study.completeResponses}}, function (err, completeResponses) {
                    if (err) {
                        res.status(504);
                        logger.error("cardsort_server.js: Error in edit cardsort:", err);
                        res.end(err);
                    } else {
                        const PROMOTER_SCORE_MIN = 9;
                        const DETRACTOR_SCORE_MAX = 6;

                        var questions = ['On a scale of 0-10, how likely are you to recommend this product or service to a friend or colleague?'];
                        var rawResponses = completeResponses;
                        var npsResults = [];

                        var npsScore = 0;
                        var promoters = 0;
                        var detractors = 0;
                        var respondents = completeResponses.length;

                        // Count the number of promoters and detractors and
                        // add a token denoting the sentiment of each response value
                        completeResponses.forEach(function(element) {
                            let response = element.data[0];

                            if (response <= DETRACTOR_SCORE_MAX) {
                                detractors += 1;
                                npsResults.push('Detractor'); 
                            } else if (response >= PROMOTER_SCORE_MIN) {
                                promoters += 1;
                                npsResults.push('Promoter');
                            } else {
                                npsResults.push('Neutral');
                            }
                        });

                        // Calculate NPS based on promoters and detractors
                        npsScore = ((promoters - detractors) / respondents) * 100;

                        res.render('nps/results.ejs',{study: study, 
                                                    completeResponses: completeResponses,
                                                    questions: questions,
                                                    rawResponses: rawResponses,
                                                    npsResults: npsResults,
                                                    npsScore: npsScore,    
                                                    email: req.user.email,
                                                    admin: req.session.admin});
                    }
                });

            }
        });
    },
    update: function (req, res, next) {
        Study.findOne({ _id: req.body.id, ownerID: req.user._id},
            function (err, study) {
            if (err) {
                res.status(504);
                logger.error('nps_server.js: error updating NPS:', err);
                res.end(err);
            }
            else {
                study.title = req.body.title;
                study.status = req.body.status;
                study.private = req.body.private;
                study.save();
                res.redirect('/studies');
                res.end();
            }
        });
    },
}
