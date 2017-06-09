var mongoose = require('mongoose');  
var Project = new mongoose.Schema({
	name: { type: String }
});

mongoose.model('Project', Project);


mongoose.connect('mongodb://127.0.0.1/kort');

