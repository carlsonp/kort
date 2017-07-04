var mongoose = require('mongoose');  

var TreeTestStudy = new mongoose.Schema({
	title: String,
	type: String,
	tasks: [],
    tree: [],
    responses: [{
		participantID: String,
		tasks: [],
		paths: [],
	}],
	active: Boolean,
	ownerID: String,
	sharedUserIDs: []
});

module.exports = mongoose.model('TreeTestStudy', TreeTestStudy);
