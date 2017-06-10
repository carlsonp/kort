require('mongoose').model('Study');

var mongoose = require('mongoose');
var Study = mongoose.model('Study');

module.exports = {
  createStudy: function (req, res) {
    var studyData = req.body;
    var newStudy = new Study({ title: studyData.title,
                type: studyData.type,
                cards: studyData.cards,
                groups: studyData.groups,});
    newStudy.save(function (err) {
      if (err) {
        console.log('Error saving study.');
        res.status(504);
        res.end(err);
      } else {
        console.log('Saved study to database Successfully.');
        req.method = 'GET';
		    res.redirect('/admin');
        res.end();
      }
    });
  },
  loadAdminPage: function (req, res, next) {
    Study.find({}, function (err, docs) {
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
    Study.find({_id: req.params.id}, function (err, docs) {
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
    Study.find({ _id: req.params.id}, function(err) {
      if(err) {
        req.status(504);
		    console.log("Cannot find study to delete:" + req.params.id);
        req.end();
        console.log(err);
      }
    }).remove(function (err) {
      console.log(err);
      if (err) {
        res.end(err);            
      } else {
    		req.method = 'GET';
    		res.redirect('/admin');
        res.end();
      }
    });
  }
}
