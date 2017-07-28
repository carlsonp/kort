$( document ).ready(function() {
    $( ".successMessage" ).slideDown(300).delay(2000).slideUp(300);
    $( ".errorMessage" ).slideDown(300);
});
function confirmDelete(href,username){
	 bootbox.confirm({
    	size: 'small',
    	closeButton: false,
	    message: "<b>Delete "+username+"?</b><br>This will also delete any studies created by this user.",
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