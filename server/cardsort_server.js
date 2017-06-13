require('mongoose').model('CardSortStudy');
var mongoose = require('mongoose');

var CardSortStudy = mongoose.model('CardSortStudy');

module.exports = {
    create: function (req, res) {
        var studyData = req.body;
      	var cards = studyData.cards.split(",").map(function(item) {
      	     return item.trim();
      	});
      	var groups = studyData.groups.split(",").map(function(item) {
      	     return item.trim();
      	});
      	var newStudy = new CardSortStudy({
            title: studyData.title,
            type: studyData.type,
            studyType: studyData.studyType,
            cards: cards,
            groups: groups,
        });
    	newStudy.save(function (err) {
        	if (err) {
        		console.log('cardsort_server.js: Error creating new cardsort.');
        		res.status(504);
        		res.end(err);
        	} else {
        		console.log('cardsort_server.js: Created new cardsort successfully.');
        		res.redirect('/admin');
        		res.end();
        	}
        });
    },
    view: function (req, res, next) {
        CardSortStudy.findOne({_id: req.params.id}, function (err, docs) {
            if (err) {
                res.status(504);
                console.log("cardsort_server.js: Error viewing cardsort.");
                res.end(err);
            } else {
                res.render('cardsort.ejs',{singleStudy: docs});
            }
        });
    },
    edit: function (req, res, next) {
        CardSortStudy.find({_id: req.params.id}, function (err, docs) {
            if (err) {
                res.status(504);
                console.log("cardsort_server.js: Error getting study to edit.");
                res.end(err);
            } else {
                res.render('editStudy.ejs',{study: docs});
            }
        });
    },
    update: function (req, res, next) {
        Study.findByIdAndUpdate({ _id: req.params.id}, {$set: req.body}, options, function (err, docs) {
            if (err) {
                res.status(504);
                console.log('cardsort_server.js: error updating cardsort');
                res.end(err);
            } 
            else {
                res.render('editStudy.ejs',{study: docs});
            }
        });
    },
    delete: function(req, res, next) {
        CardSortStudy.find({ _id: req.params.id}, function(err) {
            if (err) {
                req.status(504);
        		console.log("cardsort_server.js: Cannot find study to delete:" + req.params.id);
        		console.log(err);
                req.end();
            }
        }).remove(function (err) {
            if (err) {
                console.log(err);
                res.end(err);            
            } else {
                res.redirect('/admin');
                res.end();
            }
        });
    },
}
