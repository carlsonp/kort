var mongoose = require('mongoose');  

var ProductReactionStudy = new mongoose.Schema({
	title: String,
	type: String,
	words: [],
	responses: [{
		participantID: String,
		words: [],
	}]
});

module.exports = mongoose.model('ProductReactionStudy', ProductReactionStudy);
