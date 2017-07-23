// require('mongoose').model('Study');
// require('mongoose').model('Response');
var mongoose = require('mongoose');
var Response = mongoose.model('Response');


module.exports = {
	createResponse: function(studyID, title){
		var response = new Response({
			title: title,
		    studyID: studyID,
		    //date: new Date(Date.now()),
		    data: [],
		    data_temp: [],
		    complete: false,
		});
		response.save(function (err) {
		    if (err) return handleError(err);
		});

		return response;
	},
}

