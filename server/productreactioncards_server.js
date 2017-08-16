require('mongoose').model('Study');
var mongoose = require('mongoose');
var Study = mongoose.model('Study');
var Response = mongoose.model('Response');
var resp = require('./response_server');

module.exports = {
    create: function (req, res) {
        var studyData = req.body;
        var newStudy = new Study({
            title: "Product Reaction Cards",
            type: "productreactioncards",
            data: {                
                words: ['Accessible', 'Advanced', 'Annoying', 'Appealing', 'Approachable', 'Attractive', 'Boring', 'Business-like', 'Busy', 'Calm', 'Clean', 'Clear', 'Collaborative', 'Comfortable', 'Compatible', 'Compelling', 'Complex', 'Comprehensive', 'Confident', 'Confusing', 'Connected', 'Consistent', 'Controllable', 'Convenient', 'Creative', 'Customizable', 'Cutting edge', 'Dated', 'Desirable', 'Difficult', 'Disconnected', 'Disruptive', 'Distracting', 'Dull', 'Easy to use', 'Effective', 'Efficient', 'Effortless', 'Empowering', 'Energetic', 'Engaging', 'Entertaining', 'Enthusiastic', 'Essential', 'Exceptional', 'Exciting', 'Expected', 'Familiar', 'Fast', 'Flexible', 'Fragile', 'Fresh', 'Friendly', 'Frustrating','Fun', 'Gets in the way', 'Hard to Use', 'Helpful', 'High quality', 'Impersonal', 'Impressive', 'Incomprehensible', 'Inconsistent', 'Ineffective', 'Innovative', 'Inspiring', 'Integrated', 'Intimidating', 'Intuitive', 'Inviting', 'Irrelevant', 'Low Maintenance', 'Meaningful', 'Motivating', 'Not Secure', 'Not Valuable', 'Novel', 'Old', 'Optimistic', 'Ordinary', 'Organized', 'Overbearing', 'Overwhelming', 'Patronizing', 'Personal', 'Poor quality', 'Powerful', 'Predictable', 'Professional', 'Relevant', 'Reliable', 'Responsive', 'Rigid', 'Satisfying', 'Secure', 'Simplistic', 'Slow', 'Sophisticated', 'Stable', 'Sterile', 'Stimulating', 'Straight Forward', 'Stressful', 'Time-consuming', 'Time-Saving', 'Too Technical', 'Trustworthy', 'Unapproachable', 'Unattractive', 'Uncontrollable', 'Unconventional', 'Understandable', 'Undesirable', 'Unpredictable', 'Unrefined', 'Usable', 'Useful', 'Valuable'],
            },
            status: 'closed',
            ownerID: req.user._id,
            private: false,
        });
        newStudy.save(function (err) {
            if (err) {
                console.log('productreactioncards_server.js: Error creating new.');
                res.status(504);
                res.end(err);
            } else {
                console.log('productreactioncards_server.js: Created new cardsort via POST successfully.');
                res.redirect('/editproductreactioncards/'+newStudy._id+'?new=New');
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
				var fullUrl = req.protocol + '://' + req.get('host');
                res.render('productreactioncards/edit.ejs',{title:  req.query.new || "Edit",singleStudy: study, email: req.user.email, url: fullUrl});
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
                    var response = study.completeResponses[i].data;
                    for (var j = 0; j < response.length; j++) {
                        allWords.push(response[j]);
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
                study.private = req.body.private;
				study.save();
                res.redirect('/studies');
                res.end();   
            }
        });
    },

}
