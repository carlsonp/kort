$( document ).ready(function() {

	$(".logoutMessage").fadeTo(2750, 500).slideUp(500);
    $( ".loginMessage" ).slideDown(300);
    
    //bind local user registration button
    $('#newLocalUserBtn').click(function(){
		bootbox.dialog({
			message: "<h3>Sign Up</h3><hr><form id='newLocalUserForm' action='/localregistration' method='post'>\
		    <label for='email'>Email</label><br><span id='noblankemail' class='text-danger' hidden>Email cannot be blank.</span><br><input id='email' name='email' autocomplete='off' placeholder='Email Address' class='form-control' type='text' /><br/>\
		    <label for='password'>Password</label><br><span id='noblankpassword' class='text-danger' hidden>Password cannot be blank.</span><br><input id='password' name='password' autocomplete='off' placeholder='Password' class='form-control' type='password' />\
		    </form>",
			closeButton: false,
			buttons: {
				confirm: {
					label: 'Sign Up',
					className: 'btn-success pull-right',
					callback: function() {
						var emailEmpty = $('#email').val() == '';
						var usernameEmpty = $('#password').val() == '';
						if(!emailEmpty && !usernameEmpty){					
	                    	$('#newLocalUserForm').submit();
						} else {
							emailEmpty ? $('#noblankemail').show() : $('#noblankemail').hide(); 
							usernameEmpty ? $('#noblankpassword').show() : $('#noblankpassword').hide(); 
							return false;
						}
					}
				},
				cancel: {
					label: 'Cancel',
					className: 'btn-link',
					callback: function() {
						return;
					}
				}
			},
		 //    buttons: {confirm: {label: 'Sign Up',className: 'btn-success'},
	  //       		  cancel: {label: 'Cancel',className: 'btn-link'}
		 //    },
			// callback: function (result) {
			// 	if(result){
			// 		$('#newLocalUserForm').submit();
			// 	}
			// }
		});
	});
});
