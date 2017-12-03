$( document ).ready(function() {
	$('#results_table').DataTable({
		dom: 'Bfrtip',
		bPaginate: false,
		bInfo: false,
	  	scrollY:        "500px",
        scrollCollapse: true,
        paging:         false,
		language: {
	        search: "Filter"
	    },
		buttons: [
			{ extend: 'csvHtml5', text: 'Download CSV' },
			{ extend: 'copy', text: 'Copy'}
		],
		"columns": [
			null,
			null,
			null,
			{ "orderable": false },
			{ "orderable": false },	
		]
	});

	//bind delete response 
	$('#results_table_body').on( "click",'.text-danger', function(event) {
	    event.preventDefault();
	    var studyID = $(this).data("studyid");
	    var resid = $(this).data("resid");
	    var parentRow = $(this).parent().parent()
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
						url:  "/deleteresponse/"+studyID+"/"+resid,
						type: "POST",
						contentType: "application/json",
						success: function(data) {
		  	    			parentRow.remove()
		  	    			if ($('#results_table_body tr').length < 1){
		  	    				window.location.href = "/studies"
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

	$('#deleteAll').on( "click", function(event) {
	    event.preventDefault();
	    var studyID = $(this).data("studyid");
	    var title = $(this).data("title");
	    bootbox.confirm({
	    	size: 'small',
	    	closeButton: false,
		    message: "<b>Delete all responses for "+title+"?</b><br>This cannot be undone.",
		    buttons: {confirm: {label: 'Delete All Responses',className: 'btn-danger'},
	        		  cancel: {label: 'Cancel',className: 'btn-link'}
		    },
		    callback: function (result) {
		    	if(result){
		    		$.ajax({
						url:  "/deleteAllCompleteResponses/"+studyID,
						type: "GET",
						contentType: "application/json",
						success: function(data) {
		  	    			$("#results_table_body tr").remove(); 
		  	    			window.location.href = "/studies"
						},
						error:   function(xhr, text, err) {
						  logger.info("private.ejs: clearstudy ajax error");
						}
					});
		    	} 
		    }
		});
	});
 });


