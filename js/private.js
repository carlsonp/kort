$( document ).ready(function() {
	//create clipboard object
	//var clip = new Clipboard('.copyText');

    //toggles between link and links for responses
 	$("[name='private']").change(function() {
 		console.log('sdfsdf');
	  $("#responseListArea").toggle();
	  $("#responseSingleArea").toggle();
	});

	if ($('#responses_table_body tr').length < 1){
		$('#responses_table').hide();
	}	

	$('#newResponseInput').keypress(function (e) {
		if(e.which == 13) {
	    	$('#addResponseBtn').click();
	    	return false;  
  		}
	}); 

 	//bind response add button
 	$('#addResponseBtn').click(function(){
 		var studyID = $(this).data("studyid");
 		var url = $(this).data("url");
 		var title = $('#newResponseInput').val();
 		var studyType = $(this).data("studytype");
 		if (title == '') {
 			title = "Anonymous";
 		}
		$.ajax({
	        url: '/createresponse_ajax/'+studyID,
	        type: "POST",
	        data: {title: title},
	        success: function(response) {
	          	$(`<tr>
	          			<td>`+response.title+`</td>
						<td><a href='`+url+`/`+studyType+`/`+studyID+`/`+response._id+`'>`+url+`/`+studyType+`/`+studyID+`/`+response._id+`</a></td>
						<td><a href="" class="copyText" data-placement="right" data-clipboard-text="`+url+`/`+studyType+`/`+studyID+`/`+response._id+`" data-toggle="tooltip" title="Copied!">Copy</a></td>
						<td><a class='text-danger' data-studyid="`+studyID+`" data-resid="`+response._id+`" href="">Delete</a></td>
					</tr>`).appendTo($('#responses_table_body'));
	          	$('#responses_table').show();
	        },
	        error:   function(xhr, text, err) {
	      		console.log("Response: Please check ajax request");
	        }
	  	});
 		$('#newResponseInput').val("");
 	});

 	//bind tooltip objects for clipboar
 	$('#responses_table_body').on( "click",'.copyText', function(event) {
	    event.preventDefault();
	    $('.copyText').tooltip({trigger: 'manual'});
	    var tt = $(this); 
 		tt.tooltip("show");
 		setTimeout(function(){
			tt.tooltip('hide');
	    }, 1000);
	});

 	$('#responseSingleArea').on( "click",'.copyText', function(event) {
	    event.preventDefault();
	    $('.copyText').tooltip({trigger: 'manual'});
	    var tt = $(this); 
 		tt.tooltip("show");
 		setTimeout(function(){
			tt.tooltip('hide');
	    }, 1000);
	});
	
	//bind delete response 
	$('#responses_table_body').on( "click",'.text-danger', function(event) {
	    event.preventDefault();
	    var studyID = $(this).data("studyid");
	    var resid = $(this).data("resid");
	    var parentRow = $(this).parent().parent()
	    bootbox.confirm({
	    	size: 'small',
	    	closeButton: false,
		    message: "<b>Delete link?</b><br>This cannot be undone.",
		    buttons: {confirm: {label: 'Delete link',className: 'btn-danger'},
	        		  cancel: {label: 'Cancel',className: 'btn-link'}
		    },
		    callback: function (result) {
		    	if(result){
		    		$.ajax({
						url:  "/deleteresponse/"+studyID+"/"+resid,
						type: "POST",
						contentType: "application/json",
						success: function(data) {
		  	    			parentRow.remove();
		  	    			if ($('#responses_table_body tr').length < 1){
		  	    				$('#responses_table').hide();
	    					}	
						},
						error:   function(xhr, text, err) {
						  console.log("private.ejs: delete Response ajax error");
						}
					});
		    	}
		    }
		});
	});

	$('#responses_table').on( "click",'.clear-responses', function(event) {
	    event.preventDefault();
	    var studyID = $(this).data("studyid");
	    var title = $(this).data("title");
	    bootbox.confirm({
	    	size: 'small',
	    	closeButton: false,
		    message: "<b>Delete all links for "+title+"?</b><br>This cannot be undone.",
		    buttons: {confirm: {label: 'Delete All Links',className: 'btn-danger'},
	        		  cancel: {label: 'Cancel',className: 'btn-link'}
		    },
		    callback: function (result) {
		    	if(result){
		    		$.ajax({
						url:  "/deleteAllIncompleteResponses/"+studyID,
						type: "GET",
						contentType: "application/json",
						success: function(data) {
		  	    			$("#responses_table_body tr").remove(); 
		  	    			$('#responses_table').hide();
						},
						error:   function(xhr, text, err) {
						  console.log("private.ejs: clearstudy ajax error");
						}
					});
		    	} 
		    }
		});
	});
 });


