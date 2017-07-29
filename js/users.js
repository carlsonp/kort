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
        		  cancel: {label: 'Cancel',className: 'btn-default'}
	    },
	    callback: function (result) {
	    	if(result){
	    		window.location.href = href
	    	}
	    }
	});
}
function resetPassword(userid){
	bootbox.prompt({
		title: "New password",
		inputType: "password",
		buttons: {
			confirm: {
				label: 'Reset Password',
				className: 'btn-success'
			},
			cancel: {
				label: 'Cancel',
				className: 'btn-default'
			}
		},
		callback: function(result) {
			if(result){
				$.post({
					url: "/resetpassword",
					type: "POST",
					data: JSON.stringify({userid: userid, password: result}),
					contentType: "application/json",
				});
			} else {
				alert("Password cannot be empty");
			}
		}
	});
}
