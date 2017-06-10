var mongoose = require('mongoose');  
var Study = new mongoose.Schema({
	name: String,
	type: { type: String },
	cards: [],
	groups: [],
});

mongoose.model('Study', Study);


mongoose.connect('mongodb://127.0.0.1/kort');

