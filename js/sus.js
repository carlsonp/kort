$(document).ready(function() {
	$('#submitForm').click(function(event) {
		event.preventDefault();
		var result = [$('input[name=1]:checked').val(),
				  $('input[name=2]:checked').val(),
				  $('input[name=3]:checked').val(),
				  $('input[name=4]:checked').val(),
				  $('input[name=5]:checked').val(),
				  $('input[name=6]:checked').val(),
				  $('input[name=7]:checked').val(),
				  $('input[name=8]:checked').val(),
				  $('input[name=9]:checked').val(),
				  $('input[name=10]:checked').val()
        ];
	   $('#hiddenResults').val(JSON.stringify(result));
	   $('#susForm').submit()
	});
});

