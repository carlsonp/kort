$(document).ready(function() {
	//intialize tooltips
	$('[data-toggle="tooltip"]').tooltip();  
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