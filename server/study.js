require('mongoose').model('CardSortStudy');
require('mongoose').model('TreeTestStudy');
require('mongoose').model('ProductReactionStudy');

var mongoose = require('mongoose');
var CardSortStudy = mongoose.model('CardSortStudy');
var TreeTestStudy = mongoose.model('TreeTestStudy');
var ProductReactionStudy = mongoose.model('ProductReactionStudy');

module.exports = {
  createStudy: function (req, res) {
    var studyData = req.body;
	var newStudy;
	switch(studyData.type) {
		case "cardsort":
			var cards = studyData.cards.split(",").map(function(item) {
			  return item.trim();
			});
			var groups = studyData.groups.split(",").map(function(item) {
			  return item.trim();
			});
			newStudy = new CardSortStudy({
						title: studyData.title,
						type: studyData.type,
            studyType: 'open',
						cards: cards,
						groups: groups,});
			break;
		case "treetest":
			newStudy = new TreeTestStudy({
						title: studyData.title,
						type: studyData.type});
			break;
		case "productreaction":
			newStudy = new ProductReactionStudy({
						title: studyData.title,
						type: studyData.type});
			break;
	}
	newStudy.save(function (err) {
	if (err) {
		console.log('Error saving CardSortStudy.');
		res.status(504);
		res.end(err);
	} else {
		console.log('Saved CardSortStudy to database Successfully.');
		res.redirect('/admin');
		res.end();
	}
    });
  },
  renderCardSort: function (req, res, next) {
    CardSortStudy.findOne({_id: req.params.id}, function (err, docs) {
      if (err) {
        res.status(504);
        console.log("Error getting studies on admin page.");
        res.end(err);
      } else {
		console.log(docs);
        res.render('cardsort.ejs',{singleStudy: docs});
      }
    });
  },
  loadAdminPage: function (req, res, next) {
    CardSortStudy.find({}, function (err, docs) {
      if (err) {
        res.status(504);
        console.log("Error getting studies on admin page.");
        res.end(err);
      } else {
        res.render('admin.ejs',{studies: docs});
      }
    });
  },
  editStudy: function (req, res, next) {
    CardSortStudy.find({_id: req.params.id}, function (err, docs) {
      if (err) {
        res.status(504);
        console.log("Error getting study to edit.");
        res.end(err);
      } else {
        // console.log("noError getting study to edit.");
        res.render('editStudy.ejs',{study: docs});
      }
    });
  },
  updateStudy: function (req, res, next) {
    Study.findByIdAndUpdate({ _id: req.params.id}, {$set: req.body}, options, function (err, docs) {
      if (err) {
        res.status(504);
        console.log('error updating');
        res.end(err);
      } 
      else {
        alert("udpated called finally");
        console.log('succ updating');
        res.render('editStudy.ejs',{study: docs});
      }
    });
  },
  deleteStudy: function(req, res, next) {
	var Study;
	switch(req.params.type) {
		case "cardsort":
			Study = mongoose.model('CardSortStudy');
			break;
		case "treetest":
			Study = mongoose.model('TreeTestStudy');
			break;
		case "productreaction":
			Study = mongoose.model('ProductReactionStudy');
			break;
	}
    Study.find({ _id: req.params.id}, function(err) {
      if (err) {
        req.status(504);
		console.log("Cannot find study to delete:" + req.params.id);
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
  }
}
