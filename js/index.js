$( document ).ready(function() {
    $( ".loginMessage" ).slideDown(300);
    $( ".logoutMessage" ).slideDown(300);
    
    //bind local user registration button
    $('#newLocalUserBtn').click(function(){
		bootbox.confirm({
			message: "<h3>Sign Up</h3><hr><form id='newLocalUserForm' action='/localregistration' method='post'>\
		    <label for='email'>Email</label><input id='email' name='email' autocomplete='off' placeholder='Email Address' class='form-control' type='text' /><br/>\
		    <label for='password'>Password</label><input id='password' name='password' autocomplete='off' placeholder='Password' class='form-control' type='password' />\
		    </form>",
			closeButton: false,
		    buttons: {confirm: {label: 'Sign Up',className: 'btn-success'},
	        		  cancel: {label: 'Cancel',className: 'btn-link'}
		    },
			callback: function (result) {
				if(result){
					$('#newLocalUserForm').submit();
				}
			}
		});
	});
});
