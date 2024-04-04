var mongoose = require('mongoose');

var Event = new mongoose.Schema({
	id: String,
	iso_timestamp_sent: String,
	iso_timestamp_received: String,
	data: Object,
});

module.exports = mongoose.model('Event', Event);
