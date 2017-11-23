require('mongoose').model('Study');
require('mongoose').model('Response');
var mongoose = require('mongoose');
var Study = mongoose.model('Study');
var Response = mongoose.model('Response');
var resp = require('./response_server');

module.exports = {
     create: function (req, res) {
        var newStudy = new Study({
            title: "New System Usability Scale",
            type: "sus",
            dateCreated: new Date(Date.now()),
            data: {
                
            },
            status: 'closed',
            ownerID: req.user._id,
            private: false,
        });
        newStudy.save(function (err) {
            if (err) {
                console.log('sus_server.js: Error creating new cardsort via POST.');
                res.status(504);
                res.end(err);
            } else {
                console.log('sus_server.js: Created new sus via POST successfully.');
                var fullUrl = req.protocol + '://' + req.get('host')
                res.redirect('/editsus/'+newStudy._id+'?new=New');
                res.end();
            }
        });
    },
    edit: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, docs) {
            if (err) {
                res.status(504);
                console.log("sus_server.js: Error edit sus.");
                res.end(err);
            } else {
                var fullUrl = req.protocol + '://' + req.get('host');
                res.render('sus/edit.ejs',{title: req.query.new || "Edit",singleStudy: docs, email: req.user.email, url: fullUrl});
            }
        });
    },
    results: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("sus_server.js: Error getting study to see results.");
                res.end(err);
            } else {

                var questions = ['I think that I would like to use this system frequently',
                    'I found the system unnecessarily complex',
                    'I thought the system was easy to use',
                    'I think that I would need the support of a technical person to be able to use this system',
                    'I found the various functions in this system were well integrated',
                    'I thought there was too much inconsistency in this system',
                    'I would imagine that most people would learn to use this system very quickly',
                    'I found the system very cumbersome to use',
                    'I felt very confident using the system',
                    'I needed to learn a lot of things before I could get going with this system'];
                var rawResponses = study.completeResponses;
                var adjustedResponses = [];
                var calcScores = [];
                var averageResponse = [];
                for (var i = 0; i < study.completeResponses.length; i++) {
                    var adjusted_response = []
                    adjusted_response.push(study.completeResponses[i].data[0]-1);
                    adjusted_response.push(5-study.completeResponses[i].data[1]);
                    adjusted_response.push(study.completeResponses[i].data[2]-1);
                    adjusted_response.push(5-study.completeResponses[i].data[3]);
                    adjusted_response.push(study.completeResponses[i].data[4]-1);
                    adjusted_response.push(5-study.completeResponses[i].data[5]);
                    adjusted_response.push(study.completeResponses[i].data[6]-1);
                    adjusted_response.push(5-study.completeResponses[i].data[7]);
                    adjusted_response.push(study.completeResponses[i].data[8]-1);
                    adjusted_response.push(5-study.completeResponses[i].data[9]);
                    score = adjusted_response.reduce(function(a,b){return a+b},0)*2.5;
                    calcScores.push(score);
                    adjustedResponses.push(adjusted_response);
                }

                for (var i = 0; i < 10; i++) {
                    var sum = 0;
                    for (var j = 0; j < adjustedResponses.length; j++) {
                        sum+=adjustedResponses[j][i];
                    }
                    averageResponse.push(sum/adjustedResponses.length);
                }

                var averageSUS = calcScores.reduce(function(a,b){return a+b},0)/study.completeResponses.length;

				res.render('sus/results.ejs',{study: study, 
                                            questions: questions,
                                            rawResponses: rawResponses,
                                            adjustedResponses: adjustedResponses,
                                            averageResponse: averageResponse,
                                            calcScores: calcScores,
                                            averageSUS: averageSUS,    
                                            email: req.user.email});
            }
        });
    },
    update: function (req, res, next) {
        Study.findOne({ _id: req.body.id, ownerID: req.user._id},
            function (err, study) {
            if (err) {
                res.status(504);
                console.log('sus_server.js: error updating sus');
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
