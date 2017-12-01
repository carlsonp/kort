$(document).ready(function() {
    $('#submitForm').click(function(event) {
        event.preventDefault();
        var result = $('input[name=1]:checked').val();
        var completed = true;
        
        if (result == null) completed = false;
        
        if (completed){
            $('#hiddenResults').val(JSON.stringify(result));
               $('#npsForm').submit();
        }
           
    });
    // once all items have answers, enable the submit button
    // this is one way to do validation
    $("input").change(function(){
        if ($('input[name=1]:checked').val()) {
            $('#submitForm').removeClass('disabled');
            $('#submitForm').addClass('btn-amber');
        } else {
            $('#submitForm').removeClass('btn-amber');
            $('#submitForm').addClass('disabled');
        }
    });
});

