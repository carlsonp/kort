var mongoose = require('mongoose');  

var Response = new mongoose.Schema({
	studyID: String,
	data: [],
	data_temp: [],
	status: Boolean,
});

module.exports = mongoose.model('Response', Response);


