var mongoose = require('mongoose');
var Response = mongoose.model('Response');
var Study = mongoose.model('Study');

module.exports = {
	createResponse: function(studyID, title){
		var response = new Response({
			title: title,
		    studyID: studyID,
		    data: [],
		    complete: false,
		});
		response.save(function (err) {
		    if (err) return handleError(err);
		});
		return response;
	},
	create_ajax: function (req, res) {
		var response = new Response({
		    studyID: req.params.studyID,
		    data: [],
		    complete: false,
		});
		Study.findOne({_id: req.params.studyID}, function (err, study) {
            if (err) {
                res.status(504);
                console.log("cardsort_server.js: Error viewing cardsort.");
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