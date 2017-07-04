
module.exports = function(mongoURL, mongoose) {
	//use default ES6 for promises, potential
	//for using bluebird for increased performance
	//https://stackoverflow.com/questions/38138445/node3341-deprecationwarning-mongoose-mpromise
	mongoose.Promise = global.Promise;

	//https://stackoverflow.com/questions/44749700/how-to-set-usemongoclient-mongoose-4-11-0
	mongoose.connect(mongoURL, { useMongoClient: true });
}
