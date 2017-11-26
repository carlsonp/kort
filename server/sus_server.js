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
                var raw_percentile_ranks = [[5,0.3],[10,0.4],[15,0.7],[20,1.0],[25,1.5],[30,2],[35,4],[40,6],[45,8],[50,13],[55,17],[60,29],[65,41],[66,44],[67,47],[68,50],[69,53],[70,56],[71,60],[72,63],[73,67],[74,70],[75,73],[76,77],[77,80],[78,83],[79,86],[80,88],[85,97],[90,99.80],[95,99.99],[100,100]];
                var curved_grading_table = [
                    [84.1,100,"A+","96% - 100%"],
                    [80.8,84.0,"A","90% - 95%"],
                    [78.9,80.7,"A-","85% - 89%"],
                    [72.2,78.8,"B+","80% - 84%"],
                    [74.1,77.1,"B","70% - 79%"],
                    [72.6,74.0,"B-","65% - 69%"],
                    [71.1,72.5,"C+","60% - 64%"],
                    [65.0,71.0,"C","41% - 59%"],
                    [62.7,64.9,"C-","35% - 40%"],
                    [51.7,62.6,"D","15% - 34%"],
                    [0.0,51.6,"F","0% - 14%"]];
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


                var curved_grading_table_idx = 0;
                for (var i = 0; i < curved_grading_table.length; i++) {
                     if (curved_grading_table[i][1] > averageSUS && averageSUS > curved_grading_table[i][0]){
                        
                        curved_grading_table_idx = i;
                    }
                }

                var raw_percentile_ranks_idx = 0;
                var ABS = 100;
                for (var i = 0; i < raw_percentile_ranks.length; i++) {
                    var abs = Math.abs(raw_percentile_ranks[i][0] - averageSUS);
                    if (abs <= ABS){
                        raw_percentile_ranks_idx = i;
                        ABS = abs;
                    }
                }

				res.render('sus/results.ejs',{study: study, 
                                            questions: questions,
                                            rawResponses: rawResponses,
                                            adjustedResponses: adjustedResponses,
                                            averageResponse: averageResponse,
                                            calcScores: calcScores,
                                            averageSUS: averageSUS,    
                                            curved_grading_table: curved_grading_table,
                                            curved_grading_table_idx: curved_grading_table_idx,
                                            raw_percentile_ranks:raw_percentile_ranks,
                                            raw_percentile_ranks_idx: raw_percentile_ranks_idx,
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
