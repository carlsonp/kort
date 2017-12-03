$( document ).ready(function() {
    $( ".successMessage" ).slideDown(300).delay(2000).slideUp(300);
    $( ".errorMessage" ).slideDown(300);

	users_table = $('#userstable').DataTable({
		"bLengthChange": false,
		"pagingType": "numbers",
		"pageLength": 10,
		"info":     true,
		"searching": true,
		 "language": {
	        "emptyTable": "No users found, create one using the button above.",
	        "info":           "Showing _START_ - _END_ of _TOTAL_ entries",
	        "search": "_INPUT_",
        	"searchPlaceholder": "Search",
	    },
		"columns": [
		    null,
		    null,
		    null,
		    { "orderable": false },
		    { "orderable": false },
		    { "orderable": false },
		],
	});

    //bind new user button
    $('#newUserBtn').click(function(){
		bootbox.confirm({
			message: "<h3>Add User</h3><form id='newUserForm' action='/createuser' method='post'>\
		    <input id='email' name='email' autocomplete='off' placeholder='Email Address' class='form-control' type='text' /><br/>\
		    <input id='password' name='password' autocomplete='off' placeholder='Password' class='form-control' type='password' />\
		    <br>\
		    <input id='admin' name='admin' type='checkbox'> Admin\
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
	$('#userstable').on( "click",'.grant-admin', function(event) {
		event.preventDefault();
		var userID = $(this).data("userid");
		window.location.href = '/grantadmin/'+userID+'/'
	});

	$('#userstable').on( "click",'.revoke-admin', function(event) {
		event.preventDefault();
		var userID = $(this).data("userid");
		window.location.href = '/revokeadmin/'+userID+'/'
	});

    //bind delete user link
	$('#userstable').on( "click",'.text-danger', function(event) {
		event.preventDefault();
		var userID = $(this).data("userid");
		var email = $(this).data("email");
	    bootbox.confirm({
	    	size: 'small',
	    	closeButton: false,
		    message: "<b>Delete "+email+"?</b><br>This will also delete any studies created by this user.",
		    buttons: {confirm: {label: 'Delete User',className: 'btn-danger'},
	        		  cancel: {label: 'Cancel',className: 'btn-default'}
		    },
		    callback: function (result) {
		    	if(result){
		    		window.location.href = '/deleteuser/'+userID+'/'
		    	}
		    }
		});
	});
	//bind password reset link
	$('#userstable').on( "click",'.passwordreset', function(event) {
		event.preventDefault();
		var userid = $(this).data("email");
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
		                success: function (data) {
		                    	$("#password-reset-success").fadeTo(2750, 500).slideUp(500, function(){
								$("#password-reset-success").slideUp(500);
		                    });
		                }
					});
				} else if (result == null) {
					//do nothing if cancel was clicked
				} else {
					//send up an alert if change button was pressed, but password was empty
					alert("Password cannot be empty");
				}
			}
		});
	});

});

