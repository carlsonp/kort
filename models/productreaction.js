var mongoose = require('mongoose');  

var ProductReactionStudy = new mongoose.Schema({
	title: String,
	type: String,
	words: [],
	responses: [],
	active: Boolean,
	ownerID: String,
	sharedUserIDs: []
});

module.exports = mongoose.model('ProductReactionStudy', ProductReactionStudy);
