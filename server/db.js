
module.exports = function(mongoURL, mongoose) {
	//use default ES6 for promises, potential
	//for using bluebird for increased performance
	//https://stackoverflow.com/questions/38138445/node3341-deprecationwarning-mongoose-mpromise
	mongoose.Promise = global.Promise;

	mongoose.connect(mongoURL);
}