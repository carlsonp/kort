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
	active: Boolean
});

module.exports = mongoose.model('TreeTestStudy', TreeTestStudy);
