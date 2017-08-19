$(document).ready(function() {
	//intialize tooltips
	$('[data-toggle="tooltip"]').tooltip();

	studies_table = $('#studies_table').DataTable({
		"paging":   false,
		"info":     false,
		"searching": false,
		 "language": {
	        "emptyTable":     "No studies found, create one using the button above."
	    },
		"columns": [
		    null,
		    null,
		    null,
		    null,
		    { "orderable": false },
		    { "orderable": false },
		    { "orderable": false },
		    { "orderable": false },
		    { "orderable": false },
		  ]
	});
});

function confirmDeleteStudy(href,studyTitle){
	 bootbox.confirm({
    	size: 'small',
    	closeButton: false,
	    message: "<b>Delete "+studyTitle+"?</b><br>This will delete all responses and associated data.",
	    buttons: {confirm: {label: 'Delete',className: 'btn-danger'},
        		  cancel: {label: 'Cancel',className: 'btn-link'}
	    },
	    callback: function (result) {
	    	if(result){
	    		window.location.href = href
	    	}
	    }
	});
}
