require('mongoose').model('Study');

var mongoose = require('mongoose');
var Study = mongoose.model('Study');


module.exports = {
  createStudy: function (req, res) {
    var study = req.body;
    new Study({ name: study.name,
                type: study.type,
                cards: study.cards,
                groups: study.groups,})
      .save(function (err) {
        if (err) {
          console.log('error on the dal');
          res.status(504);
          res.end(err);
        } else {
          console.log('lookinggood');
          res.end();
        }
      });
  },
  deleteStudy: function(req, res, next) {
    console.log(req.params.id);
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
        res.end();
      }
    });
  }
}