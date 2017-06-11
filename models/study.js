var mongoose = require('mongoose');  

var CardSortStudy = new mongoose.Schema({
	title: { type: String },
	type: String,
	cards: [],
	groups: [],
});

var TreeTestStudy = new mongoose.Schema({
	title: { type: String },
	type: String,
});

var ProductReactionStudy = new mongoose.Schema({
	title: { type: String },
	type: String,
});

mongoose.model('CardSortStudy', CardSortStudy);
mongoose.model('TreeTestStudy', TreeTestStudy);
mongoose.model('ProductReactionStudy', ProductReactionStudy);