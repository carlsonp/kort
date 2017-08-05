var mongoose = require('mongoose');  

var Response = new mongoose.Schema({
	title: String,
	date: Date,
	studyID: String,
	data: [],
	complete: Boolean,
});

module.exports = mongoose.model('Response', Response);

var Study = new mongoose.Schema({
	title: String,
	type: String,
	completeResponses: [Response],
	incompleteResponses: [Response],
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

module.exports = mongoose.model('Study', Study);


