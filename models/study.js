var mongoose = require('mongoose');  

var Study = new mongoose.Schema({
	title: String,
	type: String,
	responses: [],
	status: {
		type: String,
		enum: ['open', 'closed'],
	},
	ownerID: String,
	sharedUserIDs: [],
	data: {},
});

module.exports = mongoose.model('Study', Study);


