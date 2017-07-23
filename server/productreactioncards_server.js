require('mongoose').model('Study');
var mongoose = require('mongoose');
var Study = mongoose.model('Study');
var Response = mongoose.model('Response');
var resp = require('./response');

module.exports = {
    create_ajax: function (req, res) {
        var studyData = req.body;
        var newStudy = new Study({
            title: "Product Reaction Cards",
            type: "productreactioncards",
            data: {
                words: ['Accessible', 'Desirable', 'Gets in the way', 'Patronizing', 'Stressful', 'Appealing', 'Easy to use', 'Hard to use', 'Personal', 'Time-consuming', 'Attractive', 'Efficient', 'High quality', 'Predictable', 'Time-saving', 'Busy', 'Empowering', 'Inconsistent', 'Relevant', 'Too technical', 'Collaborative', 'Exciting', 'Intimidating', 'Reliable', 'Trustworthy', 'Complex', 'Familiar', 'Inviting', 'Rigid', 'Uncontrollable', 'Comprehensive', 'Fast', 'Motivating', 'Simplistic', 'Unconventional', 'Confusing', 'Flexible', 'Not valuable', 'Slow', 'Unpredictable', 'Connected', 'Fresh', 'Organized', 'Sophisticated', 'Usable', 'Consistent', 'Frustrating', 'Overbearing', 'Stimulating', 'Useful', 'Customizable', 'Fun', 'Overwhelming', 'Straight Forward', 'Valuable'],
            },
            status: 'closed',
            ownerID: req.user._id
        });
        newStudy.save(function (err) {
            if (err) {
                console.log('productreactioncards_server.js: Error creating new.');
                res.status(504);
                res.end(err);
            } else {
                console.log('productreactioncards_server.js: Created new successfully.');
                res.send(newStudy);
                res.end();
            }
        });
    },
    view: function (req, res, next) {
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
                console.log("productreactioncards_server.js: Error viewing.");
                res.end(err);
            } else {
                study.incompleteResponses.push(response);
                study.save();
                res.render('productreactioncards/view.ejs',{singleStudy: study, response: responseID});
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
                res.render('productreactioncards/edit.ejs',{singleStudy: docs, email: req.user.email});
            }
        });
    },
    results: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("productreactioncards_server.js: Error getting study to see results.");
                res.end(err);
            } else {
                //gather all words from all responses and put into single array
                var allWords = []
                for (var i = 0; i < study.completeResponses.length; i++) {
                    var response = study.completeResponses[i].data
                    for (var j = 0; j < response.length; j++) {
                        allWords.push(response[j])
                    }
                }
                var combined = allWords.reduce(function (acc, curr) {
                  if (typeof acc[curr] == 'undefined') {acc[curr] = 1;} 
                  else {acc[curr] += 1;}
                  return acc;
                }, {});
                var words = Object.keys(combined);
                var counts = [];
                for (var i = 0; i < words.length; i++) {
                    counts.push(combined[words[i]]);
                }

                res.render('productreactioncards/results.ejs',{study: study, words: words, counts: counts, email: req.user.email});
            }
        });
    },
    update: function (req, res, next) {
        var words = req.body.words.split(/\r?\n/).map(function(item) {
             return item.trim();
        }).filter(function(n){ return n != ''});
        Study.findOne({_id: req.body.id, ownerID: req.user._id}, 
            function (err, study) {
            if (err) {
                res.status(504);
                console.log('productreactioncards_server.js: error updating');
                res.end(err);
            } 
            else {
				study.title = req.body.title;
                study.data = {
                    words: words,
                };
				study.status = req.body.status;
				study.save();
                res.redirect('/studies');
                res.end();   
            }
        });
    },

}
