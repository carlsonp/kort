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
			participantID,
			groups: [{
				cards: []
			}]
		}]
});

var TreeTestStudy = new mongoose.Schema({
	title: String,
	type: String,
});

var ProductReactionStudy = new mongoose.Schema({
	title: String,
	type: String,
});

mongoose.model('CardSortStudy', CardSortStudy);
mongoose.model('TreeTestStudy', TreeTestStudy);
mongoose.model('ProductReactionStudy', ProductReactionStudy);