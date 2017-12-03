var mongoose = require('mongoose');
var Response = mongoose.model('Response');
var Study = mongoose.model('Study');

var logger = require('./logger.js');

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
            title: req.body.title,
		    studyID: req.params.studyID,
		    data: [],
		    complete: false,
		});
		Study.findOne({_id: req.params.studyID}, function (err, study) {
            if (err) {
                res.status(504);
                logger.error("response_server.js: Error creating response:", err);
                res.end(err);
            } else {
            	study.incompleteResponses.push(response._id);
                study.save();
            }
                
        });
		response.save(function (err) {
		     if (err) {
                logger.error('response_server.js: Error creating new reponse via POST:', err);
                res.status(504);
                res.end(err);
            } else {
                logger.info('response_server.js: Created new response via POST successfully.');
                res.send(response);
                res.end();
            }
		});
    },
    delete: function(req, res, next) {
        Study.findOne({ _id: req.params.studyID}, function(err,study) {
            if (err) {
                req.status(504);
                logger.error("response_server.js: Cannot find study to delete:", err);
                req.end();
            } else {
                study.incompleteResponses.pull(req.params.resid);
                study.completeResponses.pull(req.params.resid);
            	study.save();
                Response.findOne({ _id: req.params.resid}, function(err,response) {
                    if (err) {
                        req.status(504);
                        logger.error("response_server.js: Cannot find study responses to delete:", error);
                        req.end();
                    } else {
                        response.remove();
                        res.send(true);
                        res.end();
                    }
                });
            }
        });
    },
}
