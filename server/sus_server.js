require('mongoose').model('Study');
require('mongoose').model('Response');
var mongoose = require('mongoose');
var Study = mongoose.model('Study');
var Response = mongoose.model('Response');
var resp = require('./response_server');

module.exports = {
     create: function (req, res) {
        var newStudy = new Study({
            title: "New System Usability Scale",
            type: "sus",
            dateCreated: new Date(Date.now()),
            data: {
                
            },
            status: 'closed',
            ownerID: req.user._id,
            private: false,
        });
        newStudy.save(function (err) {
            if (err) {
                console.log('sus_server.js: Error creating new cardsort via POST.');
                res.status(504);
                res.end(err);
            } else {
                console.log('sus_server.js: Created new sus via POST successfully.');
                var fullUrl = req.protocol + '://' + req.get('host')
                res.redirect('/editsus/'+newStudy._id+'?new=New');
                res.end();
            }
        });
    },
    edit: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, docs) {
            if (err) {
                res.status(504);
                console.log("sus_server.js: Error edit sus.");
                res.end(err);
            } else {
                var fullUrl = req.protocol + '://' + req.get('host');
                res.render('sus/edit.ejs',{title: req.query.new || "Edit",singleStudy: docs, email: req.user.email, url: fullUrl});
            }
        });
    },
    results: function (req, res, next) {
        Study.findOne({_id: req.params.id, ownerID: req.user._id}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("sus_server.js: Error getting study to see results.");
                res.end(err);
            } else {
				res.render('sus/results.ejs',{study: study, email: req.user.email});
            }
        });
    },
    update: function (req, res, next) {
        Study.findOne({ _id: req.body.id, ownerID: req.user._id},
            function (err, study) {
            if (err) {
                res.status(504);
                console.log('sus_server.js: error updating sus');
                res.end(err);
            }
            else {
				study.title = req.body.title;
				study.status = req.body.status;
                study.private = req.body.private;
				study.save();
                res.redirect('/studies');
                res.end();
            }
        });
    },
}
