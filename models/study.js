var mongoose = require('mongoose');  
// var Response = mongoose.model('Response');

var Response = new mongoose.Schema({
	studyID: String,
	data: [],
	data_temp: [],
	status: Boolean,
});

module.exports = mongoose.model('Response', Response);


var Study = new mongoose.Schema({
	title: String,
	type: String,
	responses: [Response],
	status: {
		type: String,
		enum: ['open', 'closed'],
	},
	ownerID: String,
	sharedUserIDs: [],
	data: {},
});

module.exports = mongoose.model('Study', Study);


