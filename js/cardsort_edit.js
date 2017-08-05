$( document ).ready(function() {
    $("[name='studyType']").change(function() {
	  $("#groupInputArea").toggle();
	});

 	$("[name='private']").change(function() {
	  $("#responseListArea").toggle();
	  $("#responseSingleArea").toggle();
	});
});