//global variables to be accessed by onready function and regular functions (might be a better way to do this)
var cards_table;
var groups_table;

//this function creates arrays of card list and group list and puts them
//in input fields for the 'save submission'
function updateInputArrays(){
	$('#cards').val(JSON.stringify(cards_table.column(0).data().toArray()));
	$('#groups').val(JSON.stringify(groups_table.column(0).data().toArray()));
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

    //toggles between link and links for responses
 	$("[name='private']").change(function() {
	  $("#responseListArea").toggle();
	  $("#responseSingleArea").toggle();
	});

 	//initalize cards_table DataTable
	cards_table = $('#cards_table').DataTable({
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
		var deleteLink = "<td><a class='text-danger' href='#' onclick='deleteCard(this)'>Delete</a></td>";
		cards_table.row.add([$('#newCardInput').val().trim(),deleteLink]).draw(false);
		$('#newCardInput').val('');
		updateInputArrays();
	});

	//initalize groups_table DataTable
	groups_table = $('#groups_table').DataTable({
		"paging":   false,
		"ordering": false,
		"info":     false,
		"searching": false,
	});

	//event listener for links within a row in the groups_table datatable
	$('#groups_table tr a').click( function (event) {
		deleteGroup(event.target);
	});

	//event listender for adding groups to the groups_table datatable
	$('#addGroupBtn').click(function(event){
		var deleteLink = "<td><a class='text-danger' href='#' onclick='deleteGroup(this)'>Delete</a></td>";
		groups_table.row.add([$('#newGroupInput').val().trim(),deleteLink]).draw(false);
		$('#newGroupInput').val('');
		updateInputArrays();
	});

	//places existing cards and groups into input fields (so save works when no changes are made)
	//or else fields are empty.
	updateInputArrays();

});

