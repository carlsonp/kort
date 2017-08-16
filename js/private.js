$( document ).ready(function() {
    //toggles between link and links for responses
 	$("[name='private']").change(function() {
	  $("#responseListArea").toggle();
	  $("#responseSingleArea").toggle();
	});

 	$('#addResponseBtn').click(function(){
 		createResponse($(this).data("studyid"),$(this).data("url"),$('#newResponseInput').val());
		// return false;
 	});

 });



function deleteResponse(studyID,responseID,target){
	bootbox.confirm({
    	size: 'small',
    	closeButton: false,
	    message: "<b>Delete Response?</b><br>This cannot be undone.",
	    buttons: {confirm: {label: 'Delete Response',className: 'btn-danger'},
        		  cancel: {label: 'Cancel',className: 'btn-link'}
	    },
	    callback: function (result) {
	    	if(result){
	    		$.ajax({
					url:  "/deleteresponse/"+studyID+"/"+responseID,
					type: "POST",
					contentType: "application/json",
					success: function(data) {
	  	    			var tableRowToDelete = $(target).parent().parent()
	    				tableRowToDelete.remove();
					},
					error:   function(xhr, text, err) {
					  console.log("private.ejs: delete Response ajax error");
					}
				});
	    	}
	    }
	});
}

function createResponse(studyID,url,title){
	$.ajax({
        url: '/createresponse_ajax/'+studyID,
        type: "POST",
        data: {title: title},
        // contentType: "application/json",
        success: function(response) {
          	$(`<tr>
					<td><a href='`+url+`/cardsort/`+studyID+`/`+response._id+`'>`+url+`/cardsort/`+studyID+`/`+response._id+`</a></td>
					<td>`+response.complete+`</td>
					<td></td>
					<td><a class='text-danger' onclick="deleteResponse('`+studyID+`','`+response._id+`',this);" href="#">Delete</a></td>
				</tr>`).appendTo($('#responses_table_body'));
        },
        error:   function(xhr, text, err) {
      		console.log("Response: Please check ajax request");
        }
  	});
}
