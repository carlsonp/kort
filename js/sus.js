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
        var completed = true;
        for (var i = 0; i < result.length; i++) {
        	if (result[i] == null) completed = false;
        }
        if (completed){
        	$('#hiddenResults').val(JSON.stringify(result));
	   		$('#susForm').submit();
        }
	   	
	});
	// once all items have answers, enable the submit button
	// this is one way to do validation
	$("input").change(function(){
    	if ($('input[name=1]:checked').val()&&
			$('input[name=2]:checked').val()&&
			$('input[name=3]:checked').val()&&
			$('input[name=4]:checked').val()&&
			$('input[name=5]:checked').val()&&
			$('input[name=6]:checked').val()&&
			$('input[name=7]:checked').val()&&
			$('input[name=8]:checked').val()&&
			$('input[name=9]:checked').val()&&
			$('input[name=10]:checked').val()) {
    			$('#submitForm').removeClass('disabled');
				$('#submitForm').addClass('btn-amber');
    	} else {
			$('#submitForm').removeClass('btn-amber');
			$('#submitForm').addClass('disabled');
    	}
	});
});

