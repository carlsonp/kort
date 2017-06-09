var mongoose = require('mongoose');  
var Project = new mongoose.Schema({
	name: { type: String }
});

mongoose.model('Project', Project);


mongoose.connect('mongodb://192.168.1.124/kort');

