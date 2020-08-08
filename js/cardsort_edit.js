//global variables to be accessed by onready function and regular functions (might be a better way to do this)
var cards_table;
var groups_table;

//this function creates arrays of card list and group list and puts them
//in input fields for the 'save submission'
function updateInputArrays(){
	$('#cards').val(JSON.stringify(cards_table.column(0).data().toArray()));
	$('#groups').val(JSON.stringify(groups_table.column(0).data().toArray()));
}

function createCard(str){
	if (str !== '') {
		var deleteLink = "<td><a class='text-danger' href='#' onclick='deleteCard(this)'>Delete</a></td>";
		cards_table.row.add([str,deleteLink]).draw(false);
		$('#newCardInput').val('');
		updateInputArrays();
	}

}

function createGroup(str){
	if (str !== '') {
		var deleteLink = "<td><a class='text-danger' href='#' onclick='deleteGroup(this)'>Delete</a></td>";
		groups_table.row.add([str,deleteLink]).draw(false);
		$('#newGroupInput').val('');
		updateInputArrays();
	}
}

function addCardsFromDialog(){
	bootbox.prompt({
		title: "<h3>Add from List</h3><p>Enter a list of cards names (one card per line).</p>",
		inputType: 'textarea',
		closeButton: false,
		message: "Add many cards at once. Enter a list of cards with one per line.",
	    buttons: {confirm: {label: 'Add',className: 'btn-success'},
        		  cancel: {label: 'Cancel',className: 'btn-link'}
	    },
		callback: function (result) {
			if(result){
				var cards = result.split(/\r?\n/).map(function(item) {
              		return item.trim();
				}).filter(function(n){ return n != '' });

				for (var i = 0; i < cards.length; i++) {
					createCard(cards[i]);
				}
			}
		}
	});
}

function addGroupsFromDialog(){
	bootbox.prompt({
		title: "<h3>Add from List</h3><p>Enter a list of group names (one per line).</p>",
		inputType: 'textarea',
		closeButton: false,
		message: "Add many groups at once. Enter a list of groups with one card per line.",
	    buttons: {confirm: {label: 'Add',className: 'btn-success'},
        		  cancel: {label: 'Cancel',className: 'btn-link'}
	    },
		callback: function (result) {
			if(result){
				var groups = result.split(/\r?\n/).map(function(item) {
              		return item.trim();
				}).filter(function(n){ return n != '' });

				for (var i = 0; i < groups.length; i++) {
					createGroup(groups[i]);
				}
			}
		}
	});
}



function deleteAllCards(){
	bootbox.confirm({
			size: 'small',
			closeButton: false,
			message: "Delete all cards?",
			buttons: {confirm: {label: 'Delete All Cards',className: 'btn-danger'},
			cancel: {label: 'Cancel',className: 'btn-link'}
		},
		callback: function (result) {
			if(result){
				cards_table.clear().draw();
				updateInputArrays();
			}
		}
	});
}

function deleteAllGroups(){
	bootbox.confirm({
			size: 'small',
			closeButton: false,
			message: "Delete all groups?",
			buttons: {confirm: {label: 'Delete All Groups',className: 'btn-danger'},
			cancel: {label: 'Cancel',className: 'btn-link'}
		},
		callback: function (result) {
			if(result){
				groups_table.clear().draw();
				updateInputArrays();
			}
		}
	});
}


//removes a list item (card) from the cards_table datatable
function deleteCard(target){
	var row = $(target).parent().parent();
	cards_table.row(row).remove().draw(false);
	updateInputArrays();
}

//removes a list item (group) from the groups_table datatable
function deleteGroup(target){
	var row = $(target).parent().parent();
	groups_table.row(row).remove().draw(false);
	updateInputArrays();
}



$( document ).ready(function() {
	//toggles input area for groups based on studyType (open or closed)
    $("[name='studyType']").change(function() {
	  $("#groupInputArea").toggle();
	});

 	//initalize cards_table DataTable
	cards_table = $('#cards_table').DataTable({
		"language": {
	        "emptyTable":     "Empty"
	    },
		"paging":   false,
		"ordering": false,
		"info":     false,
		"searching": false,
	});
	//event listener for links within a row in the cards_table datatable
	$('#cards_table tr a').click( function (event) {
		deleteCard(event.target);
	});

	//event listener for adding cards to the cards_table datatable
	$('#addCardBtn').click(function(event){
		createCard($('#newCardInput').val().trim())
	});

	//capture enter key if newCardInput has focus
	$('#newCardInput').keypress(function (e) {
		if(e.which == 13) {
	    	$('#addCardBtn').click();
	    	return false;
  		}
	});


	//initalize groups_table DataTable
	groups_table = $('#groups_table').DataTable({
		"language": {
	        "emptyTable":     "Empty"
	    },
		"paging":   false,
		"ordering": false,
		"info":     false,
		"searching": false,
	});

	//event listener for links within a row in the groups_table datatable
	$('#groups_table tr a').click( function (event) {
		deleteGroup(event.target);
	});

	//event listener for adding groups to the groups_table datatable
	$('#addGroupBtn').click(function(event){
		createGroup($('#newGroupInput').val().trim());
	});

	//capture enter key if newGroupInput has focus
	$('#newGroupInput').keypress(function (e) {
		if(e.which == 13) {
	    	$('#addGroupBtn').click();
	    	return false;
  		}
	});


	//places existing cards and groups into input fields (so save works when no changes are made)
	//or else fields are empty.
	updateInputArrays();

});
