$( document ).ready(function() {
	
    //toggles between link and links for responses
 	$("[name='private']").change(function() {
	  $("#responseListArea").toggle();
	  $("#responseSingleArea").toggle();
	});

 	$('#addResponseBtn').click(function(){
 		var studyID = $(this).data("studyid");
 		var url = $(this).data("url");
 		var title = $('#newResponseInput').val();
 		var studyType = $(this).data("studytype");
 		createResponse(studyID,url,title,studyType);
 		$('#newResponseInput').val("");
 	});

 	var clip = new Clipboard('.copyText');

 	$('#responses_table_body').on( "click",'.copyText', function(event) {
	    event.preventDefault();
	    $('.copyText').tooltip({trigger: 'manual'});
	    var tt = $(this); 
 		tt.tooltip("show");
 		setTimeout(function(){
			tt.tooltip('hide');
	    }, 1000);
	});


 });

// function bindTooltip(){
// 	$('.copyText').tooltip({trigger: 'manual'});
// 	$('.copyText').click(function(){
//  		var tt = $(this); 
//  		tt.tooltip("show");
//  		setTimeout(function(){
// 			tt.tooltip('hide');
// 	    }, 1000);
//  	});
// }


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

function createResponse(studyID,url,title,studyType){
	if (title == '') title = "Anonymous";
	$.ajax({
        url: '/createresponse_ajax/'+studyID,
        type: "POST",
        data: {title: title},
        success: function(response) {
          	$(`<tr>
          			<td>`+response.title+`</td>
					<td><a href='`+url+`/`+studyType+`/`+studyID+`/`+response._id+`'>`+url+`/`+studyType+`/`+studyID+`/`+response._id+`</a></td>
					<td><a href="" class="copyText" data-placement="right" data-clipboard-text="`+url+`/`+studyType+`/`+studyID+`/`+response._id+`" data-toggle="tooltip" title="Copied!">Copy</a></td>
					<td><a class='text-danger' onclick="deleteResponse('`+studyID+`','`+response._id+`',this);return false;" href="#">Delete</a></td>
				</tr>`).appendTo($('#responses_table_body'));
        },
        error:   function(xhr, text, err) {
      		console.log("Response: Please check ajax request");
        }
  	});
}
