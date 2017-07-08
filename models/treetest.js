var mongoose = require('mongoose');  

var TreeTestStudy = new mongoose.Schema({
	title: String,
	type: String,
	tasks: ["1. Break the Rules",
			"2. Don't Break the Rules",
			"3. Are you sure you want to break the rules?"],
    tree: ['Meats',
			'Meats/Hot Dogs',
			'Meats/Hamburger',
			'Meats/Hamburger/Plain',
			'Meats/Hamburger/Cheese Burger',
			'Meats/Steaks',
			'Fruits',
			'Fruits/Apple',
			'Fruits/Apple/Red Delicous',
			'Fruits/Apple/Gala'],
    responses: [],
	active: Boolean,
	ownerID: String,
	selectableParents: Boolean,
	showSiblings: Boolean,
	sharedUserIDs: []
});

module.exports = mongoose.model('TreeTestStudy', TreeTestStudy);
