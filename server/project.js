require('mongoose').model('Project');

var mongoose = require('mongoose');
var Project = mongoose.model('Project');


module.exports = {
  createProject: function (req, res) {
    var project = req.body;
    new Project({ name: project.name })
      .save(function (err) {
        if (err) {
          res.status(504);
          res.end(err);
        } else {
          res.end();
        }
      });
  },
  deleteProject: function(req, res, next) {
    console.log(req.params.id);
    Project.find({ _id: req.params.id}, function(err) {
      if(err) {
        req.status(504);
		console.log("Cannot find project to delete:" + req.params.id);
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