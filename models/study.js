var mongoose = require('mongoose');  

var CardSortStudy = new mongoose.Schema({
	title: String,
	type: String,
	studyType: { type: String,
				enum: ['open', 'closed'],
			},
	cards: [],
	groups: [],
	responses: [{
		participantID: String,
		groups: [{
			cards: []
		}]
	}]
});

var TreeTestStudy = new mongoose.Schema({
	title: String,
	type: String,
	tasks: [],
    tree: [],
    responses: [{
		participantID: String,
		tasks: [],
		paths: [],
	}]
});

var ProductReactionStudy = new mongoose.Schema({
	title: String,
	type: String,
	words: [],
	responses: [{
		participantID: String,
		words: [],
	}]
});

module.exports = mongoose.model('CardSortStudy', CardSortStudy);
module.exports = mongoose.model('TreeTestStudy', TreeTestStudy);
module.exports = mongoose.model('ProductReactionStudy', ProductReactionStudy);
