$(document).ready(function() {
	//intialize tooltips
	$('[data-toggle="tooltip"]').tooltip();  
	//string var for tooltip message
	var resultsNotAvailString = "Results not available until at least 1 submission completed."

  	$('#createNewCardSortBtn').on('click', function(event) {
      	$.ajax({
	        url: '/createcardsort_ajax',
	        type: "POST",
	        contentType: "application/json",
	        success: function(study) {
	          	$(`<tr>
				<td>`+study.title+`</td>
				<td>`+study.status+`</td>
				<td>`+study.type+`</td>
				<td>`+study.completeResponses.length+`</td>
				<td><a href="/cardsort/preview/`+study._id+`">View</a></td>
				<td><a style='color:gray;' onclick="return false;" href="#" data-toggle="tooltip" title="`+resultsNotAvailString+`">Results</a></td>
				<td><a href="/editcardsort/`+study._id+`">Edit</a></td>
				<td><a href='#' class="text-danger" onclick="confirmDeleteStudy('/deletestudy/`+study._id+`','`+study.title+`')">Delete</a></td>
				</tr>`).appendTo($('#studies_table_body'));

				window.location.href = '/editcardsort/'+study._id
	        },
	        error:   function(xhr, text, err) {
          		console.log("Cardsort: Please check ajax request");
	        }
      	});
      	//re-initialize toolstip for newly added study
      	$('[data-toggle="tooltip"]').tooltip();  
    });  

  	$('#createNewTreeTestBtn').on('click', function(event) {
		$.ajax({
	        url: '/createtreetest_ajax',
	        type: "POST",
	        contentType: "application/json",
	        success: function(study) {
	          $(`<tr>
				<td>`+study.title+`</td>
				<td>`+study.status+`</td>
				<td>`+study.type+`</td>
				<td>`+study.completeResponses.length+`</td>
				<td><a href="/treetest/preview/`+study._id+`">View</a></td>
				<td><a style='color:gray;' onclick="return false;" href="#" data-toggle="tooltip" title="`+resultsNotAvailString+`">Results</a></td>
				<td><a href="/edittreetest/`+study._id+`">Edit</a></td>
				<td><a href='#' class="text-danger" onclick="confirmDeleteStudy('/deletestudy/`+study._id+`','`+study.title+`')">Delete</a></td>
				</tr>`).appendTo($('#studies_table_body'));

	          	window.location.href = '/edittreetest/'+study._id

	        },
	        error:   function(xhr, text, err) {
          		console.log("Treetest: Please check ajax request");
        	}
      	});
      	//re-initialize toolstip for newly added study
      	$('[data-toggle="tooltip"]').tooltip();  
    });

    $('#createNewProductReactionCardsBtn').on('click', function(event) {
	  	$.ajax({
	        url: '/createproductreactioncards_ajax',
	        type: "POST",
	        contentType: "application/json",
	        success: function(study) {
		      	$(`<tr>
						<td>`+study.title+`</td>
						<td>`+study.status+`</td>
						<td>`+study.type+`</td>
						<td>`+study.completeResponses.length+`</td>
						<td><a href="/productreactioncards/preview/`+study._id+`">View</a></td>
						<td><a style='color:gray;' onclick="return false;" href="#" data-toggle="tooltip" title="`+resultsNotAvailString+`">Results</a></td>
						<td><a href="/editproductreactioncards/`+study._id+`">Edit</a></td>
						<td><a href='#' class="text-danger" onclick="confirmDeleteStudy('/deletestudy/`+study._id+`','`+study.title+`')">Delete</a></td>
				</tr>`).appendTo($('#studies_table_body'));
				window.location.href = '/editproductreactioncards/'+study._id
	        },
	        error:   function(xhr, text, err) {
	          console.log("ProductReactionCards: Please check ajax request");
	        }
      	});
  		$('[data-toggle="tooltip"]').tooltip();  
    });
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