require('mongoose').model('ProductReactionStudy');
var mongoose = require('mongoose');

var ProductReactionStudy = mongoose.model('ProductReactionStudy');

module.exports = {
    create_ajax: function (req, res) {
        var studyData = req.body;
        var newStudy = new ProductReactionStudy({
            title: "Desirability Exercise",
            type: "productreaction",
            words: ['Accessible', 'Desirable', 'Gets in the way', 'Patronizing', 'Stressful', 'Appealing', 'Easy to use', 'Hard to use', 'Personal', 'Time-consuming', 'Attractive', 'Efficient', 'High quality', 'Predictable', 'Time-saving', 'Busy', 'Empowering', 'Inconsistent', 'Relevant', 'Too technical', 'Collaborative', 'Exciting', 'Intimidating', 'Reliable', 'Trustworthy', 'Complex', 'Familiar', 'Inviting', 'Rigid', 'Uncontrollable', 'Comprehensive', 'Fast', 'Motivating', 'Simplistic', 'Unconventional', 'Confusing', 'Flexible', 'Not valuable', 'Slow', 'Unpredictable', 'Connected', 'Fresh', 'Organized', 'Sophisticated', 'Usable', 'Consistent', 'Frustrating', 'Overbearing', 'Stimulating', 'Useful', 'Customizable', 'Fun', 'Overwhelming', 'Straight Forward', 'Valuable'],
            responses: [],
            active: false,
            ownerID: req.user._id
        });
        newStudy.save(function (err) {
            if (err) {
                console.log('productreaction_server.js: Error creating new.');
                res.status(504);
                res.end(err);
            } else {
                console.log('productreaction_server.js: Created new successfully.');
                res.send(newStudy);
                res.end();
            }
        });
    },
    view: function (req, res, next) {
        ProductReactionStudy.findOne({_id: req.params.id}, function (err, docs) {
            if (err) {
                res.status(504);
                console.log("productreaction_server.js: Error viewing.");
                res.end(err);
            } else {
                res.render('desirability/view.ejs',{singleStudy: docs});
            }
        });
    },
    edit: function (req, res, next) {
        ProductReactionStudy.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, docs) {
            if (err) {
                res.status(504);
                console.log("cardsort_server.js: Error edit cardsort.");
                res.end(err);
            } else {
                res.render('desirability/edit.ejs',{singleStudy: docs, email: req.user.email});
            }
        });
    },
    submitResult: function (req, res, next) {
        ProductReactionStudy.findOne({ _id: req.body.id}, 
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
    results: function (req, res, next) {
        ProductReactionStudy.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("productreaction_server.js: Error getting study to see results.");
                res.end(err);
            } else {
                //gather all words from all responses and put into single array
                var allWords = []
                for (var i = 0; i < study.responses.length; i++) {
                    var response = study.responses[i]
                    for (var j = 0; j < response.length-1; j++) {
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

                res.render('desirability/results.ejs',{study: study, words: words, counts: counts, email: req.user.email});
            }
        });
    },
    update: function (req, res, next) {
        var words = req.body.words.split(/\r?\n/).map(function(item) {
             return item.trim();
        }).filter(function(n){ return n != ''});
        ProductReactionStudy.findOne({_id: req.body.id, ownerID: req.user._id}, 
            function (err, study) {
            if (err) {
                res.status(504);
                console.log('productreaction_server.js: error updating');
                res.end(err);
            } 
            else {
				study.title = req.body.title;
				study.words = words;
				study.active = req.body.active;

				study.save();
                res.redirect('/studies');
                res.end();   
            }
        });
    },
    delete: function(req, res, next) {
        ProductReactionStudy.findOne({_id: req.params.id, ownerID: req.user._id}, function(err) {
            if (err) {
                req.status(504);
        		console.log("productreaction_server.js: Cannot find study to delete:" + req.params.id);
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
