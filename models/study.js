var mongoose = require('mongoose');  

var Study = new mongoose.Schema({
	title: String,
	type: String,
	responses: [],
	active: Boolean,
	ownerID: String,
	sharedUserIDs: [],
	data: {},
});

module.exports = mongoose.model('Study', Study);


