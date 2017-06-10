var mongoose = require('mongoose');  

var Study = new mongoose.Schema({
	title: { type: String },
	type: { type: String },
	cards: [],
	groups: [],
});

mongoose.model('Study', Study);