var mongoose = require('mongoose');  

var Response = new mongoose.Schema({
	title: String,
	date: Date,
	studyID: String,
	data: [],
	complete: Boolean,
});

Response.methods.getDateStr = function() {
	var d = this.date; 
	var minutes = (d.getMinutes()<10?'0':'') + d.getMinutes();
	return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate() + " (" + d.getHours() + ":" + minutes + ")";
};

module.exports = mongoose.model('Response', Response);

var Study = new mongoose.Schema({
	title: String,
	type: String,
	dateCreated: Date,
	completeResponses: [],
	incompleteResponses: [],
	status: {
		type: String,
		enum: ['open', 'closed'],
	},
	ownerID: String,
	sharedUserIDs: [],
	data: {},
	private: Boolean,
});

Study.methods.getAllResponses = function() {
  return this.completeResponses.concat(this.incompleteResponses);
};

Study.methods.getDateStr = function() {
	var d = this._id.getTimestamp(); 
	var minutes = (d.getMinutes()<10?'0':'') + d.getMinutes();
	return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate() + " (" + d.getHours() + ":" + minutes + ")";
};

module.exports = mongoose.model('Study', Study);


