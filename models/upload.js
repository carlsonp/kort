var mongoose = require('mongoose');  

var Upload = new mongoose.Schema({
	title: String,
	path: String,
});

module.exports = mongoose.model('Upload', Upload);


