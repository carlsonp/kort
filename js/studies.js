$(document).ready(function() {
  	$('#createNewCardSortBtn').on('click', function(event) {
      	$.ajax({
	        url: '/createcardsort_ajax',
	        type: "POST",
	        contentType: "application/json",
	        success: function(study) {
	          	$(`<tr>
				<td>`+study.title+`</td>
				<td>`+study.studyType+`</td>
				<td>`+study.cards.length+`</td>
				<td>`+study.groups.length+`</td>
				<td>`+study.responses.length+`</td>
				<td><a href="/cardsort/`+study._id+`">View</a></td>
				<td><a href="/cardsortresults/`+study._id+`">Results</a></td>
				<td><a href="/editcardsort/`+study._id+`"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></a></td>
				<td><a href='#' class="text-danger" onclick="confirmDeleteStudy('/deletecardsort/`+study._id+`','`+study.title+`')"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></a></td>
				</tr>`).appendTo($('#cardsort_table_body'));
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
				<td>`+study.tasks.length+`</td>
				<td><a href="/treetest/`+study._id+`">View</a></td>
				<td><a href="/treetestresults/`+study._id+`">Results</a></td>
				<td><a href="/edittreetest/`+study._id+`"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></a></td>
				<td><a href='#' class="text-danger" onclick="confirmDeleteStudy('/deletetreetest/`+study._id+`','`+study.title+`')"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></a></td>
				</tr>`).appendTo($('#treetest_table_body'));
	        },
	        error:   function(xhr, text, err) {
          		console.log("Treetest: Please check ajax request");
        	}
      	});
    });
    $('#createNewProductReactionBtn').on('click', function(event) {
  	$.ajax({
        url: '/createproductreaction_ajax',
        type: "POST",
        contentType: "application/json",
        success: function(study) {
      	$(`<tr>
				<td>`+study.title+`</td>
				<td>`+study.words.length+`</td>
				<td>`+study.responses.length+`</td>
				<td><a href="/treetest/`+study._id+`">View</a></td>
				<td><a href="/treetestresults/`+study._id+`">Results</a></td>
				<td><a href="/edittreetest/`+study._id+`"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i></a></td>
				<td><a href='#' class="text-danger" onclick="confirmDeleteStudy('/deletetreetest/`+study._id+`','`+study.title+`')"><i class="fa fa-trash-o fa-lg" aria-hidden="true"></i></a></td>
		</tr>`).appendTo($('#productreaction_table_body'));
  
        },
        error:   function(xhr, text, err) {
          console.log("productreactions: Please check ajax request");
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


