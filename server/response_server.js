var mongoose = require('mongoose');
var Response = mongoose.model('Response');
var Study = mongoose.model('Study');

module.exports = {
	create_ajax: function (req, res) {
		var response = new Response({
            title: req.body.title,
		    studyID: req.params.studyID,
		    data: [],
		    complete: false,
		});
		Study.findOne({_id: req.params.studyID}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("response.js: Error creating response.");
                res.end(err);
            } else {
            	study.incompleteResponses.push(response);
                study.save();
            }
                
        });
		response.save(function (err) {
		     if (err) {
                console.log('response.js: Error creating new reponse via POST.');
                res.status(504);
                res.end(err);
            } else {
                console.log('response.js: Created new response via POST successfully.');
                res.send(response);
                res.end();
            }
		});
    },
    delete: function(req, res, next) {
        Study.findOne({ _id: req.params.studyID}, function(err,study) {
            if (err) {
                req.status(504);
                console.log("response_server.js: Cannot find study:" + req.params.studyID);
                console.log(err);
                req.end();
            } else {
                study.incompleteResponses.pull(req.params.resid);
                study.completeResponses.pull(req.params.resid);
            	study.save();
                res.end();
            }
        });
        Response.findOne({ _id: req.params.resid}, function(err,response) {
            if (err) {
                req.status(504);
                console.log("response_server.js: Cannot find study:" + req.params.studyID);
                console.log(err);
                req.end();
            } else {
                response.remove();
                res.end();
            }
        });
    },
}