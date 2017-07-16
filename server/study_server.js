require('mongoose').model('Study');
var mongoose = require('mongoose');
var Study = mongoose.model('Study');
var Response = mongoose.model('Response');

module.exports = {
    view: function (req, res, next) {
        Study.find({}, function (err, docs) {
            if (err) {
                res.status(504);
                console.log("admin.js: Error edit cardsort.");
                res.end(err);
            } else {
                res.render("studies.ejs", {studies: docs, email: req.user.email});
            }
        });
    },
    delete: function(req, res, next) {
        Study.findOne({ _id: req.params.id, ownerID: req.user._id}, function(err) {
            if (err) {
                req.status(504);
                console.log("admin.js: Cannot find study to delete:" + req.params.id);
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
    submitResult: function (req, res, next) {
         Study.findOne({_id: req.body.id}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("cardsort_server.js: Error viewing cardsort.");
                res.end(err);
            } else {
                var response = study.responses.id(req.body.resid);
                response.status = true;
                response.data = JSON.parse(req.body.result);
                study.responses.push(response);
                study.save();
                res.redirect('/studies');
                res.end();   
            }
        });
    },
}

