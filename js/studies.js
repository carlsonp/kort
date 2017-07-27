$(document).ready(function() {
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
				<td><a href="/cardsort/`+study._id+`">View</a></td>
				<td style='color:gray;' onclick="return false;" >Results</td>
				<td><a href="/editcardsort/`+study._id+`"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></a></td>
				<td><a href='#' class="text-danger" onclick="confirmDeleteStudy('/deletestudy/`+study._id+`','`+study.title+`')"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></a></td>
				</tr>`).appendTo($('#studies_table_body'));
	        },
	        error:   function(xhr, text, err) {
          		console.log("Cardsort: Please check ajax request");
	        }
      	});
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
				<td><a href="/treetest/`+study._id+`">View</a></td>
				<td style='color:gray;' onclick="return false;" >Results</td>
				<td><a href="/edittreetest/`+study._id+`"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></a></td>
				<td><a href='#' class="text-danger" onclick="confirmDeleteStudy('/deletestudy/`+study._id+`','`+study.title+`')"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></a></td>
				</tr>`).appendTo($('#studies_table_body'));
	        },
	        error:   function(xhr, text, err) {
          		console.log("Treetest: Please check ajax request");
        	}
      	});
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
						<td><a href="/productreactioncards/`+study._id+`">View</a></td>
						<td style='color:gray;' onclick="return false;">Results</td>
						<td><a href="/editproductreactioncards/`+study._id+`"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></a></td>
						<td><a href='#' class="text-danger" onclick="confirmDeleteStudy('/deletestudy/`+study._id+`','`+study.title+`')"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></a></td>
				</tr>`).appendTo($('#studies_table_body'));
	        },
	        error:   function(xhr, text, err) {
	          console.log("ProductReactionCards: Please check ajax request");
	        }
	      });
	    });
});
function confirmDeleteStudy(href,studyTitle){
	 bootbox.confirm({
    	size: 'small',
    	closeButton: false,
	    message: "Delete "+studyTitle+"?",
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


