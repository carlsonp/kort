$( document ).ready(function() {
    $( ".successMessage" ).slideDown(300).delay(2000).slideUp(300);
    $( ".errorMessage" ).slideDown(300);
    $('#newUserBtn').click(function(){
		bootbox.confirm({
			message: "<h3>Add User</h3><form id='newUserForm' action='/createuser' method='post'>\
		    <input id='email' name='email' autocomplete='off' placeholder='Email Address' class='form-control' type='text' /><br/>\
		    <input id='password' name='password' autocomplete='off' placeholder='Password' class='form-control' type='password' />\
		    </form>",
			closeButton: false,
		    buttons: {confirm: {label: 'Add User',className: 'btn-success'},
	        		  cancel: {label: 'Cancel',className: 'btn-link'}
		    },
			callback: function (result) {
				if(result){
					$('#newUserForm').submit();
				}
			}
		});
	});
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
				className: 'btn-warning'
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
			} else if (result == null) {
				//do nothing if cancel was clicked
			} else {
				//send up an alert if change button was pressed, but password was empty
				alert("Password cannot be empty");
			}
		}
	});
}
