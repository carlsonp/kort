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
});

var ProductReactionStudy = new mongoose.Schema({
	title: String,
	type: String,
});

module.exports = mongoose.model('CardSortStudy', CardSortStudy);
module.exports = mongoose.model('TreeTestStudy', TreeTestStudy);
module.exports = mongoose.model('ProductReactionStudy', ProductReactionStudy);
