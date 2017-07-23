var mongoose = require('mongoose');
var Response = mongoose.model('Response');

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
}

