var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var User = new mongoose.Schema({
	password: String,
	email: String
});

// generating a hash
User.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', User);
