require('mongoose').model('Study');
var mongoose = require('mongoose');
var Study = mongoose.model('Study');

module.exports = {
    create_ajax: function (req, res) {
        var newStudy = new Study({
            title: "New Cardsort",
            type: "cardsort",
            data: {
                studyType: "open",
                cards: ['card1','card2','card3'],
                groups: ['group1','group2','group3'],
            },
            responses: [],
            active: false,
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
        Study.findOne({_id: req.params.id}, function (err, docs) {
            if (err) {
                res.status(504);
                console.log("cardsort_server.js: Error viewing cardsort.");
                res.end(err);
            } else {
                res.render('cardsort/view.ejs',{singleStudy: docs});
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

				study.responses.forEach(function(response){
					response.shift(); //remove date (first item)
					response.forEach(function(pair){
						var groupIndex = study.data.groups.indexOf(pair.groupname);
						var cardIndex = study.data.cards.indexOf(pair.cardname);
						matrix[groupIndex][cardIndex]+=1;
					})
				})
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
                study.data.studyType = req.body.studyType;
                study.data.cards = cards;
                study.data.groups = groups;
				study.active = req.body.active;
				study.save();
                res.redirect('/studies');
                res.end();   
            }
        });
    },
    
}
