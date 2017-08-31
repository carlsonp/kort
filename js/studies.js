$(document).ready(function() {
	//intialize tooltips
	$('[data-toggle="tooltip"]').tooltip();
	//update names of study types in table
	$('td[data-type="cardsort"]').html('Card Sort');
	$('td[data-type="treetest"]').html('Tree Test');
	$('td[data-type="productreactioncards"]').html('Product Reaction Cards');
	$('td[data-status="open"]').html('Accepting Responses');
	$('td[data-status="closed"]').html('Not Accepting Responses');

	studies_table = $('#studies_table').DataTable({
		"bLengthChange": false,
		"pagingType": "numbers",
		"pageLength": 10,
		"info":     true,
		"searching": true,
		
		"language": {
			"emptyTable":     "No studies found, create one using the button above.",
			"info":           "Showing _START_ - _END_ of _TOTAL_ entries",
		},
		"columns": [
			null,
			null,
			null,
			null,
			null,
			{ "orderable": false },
			{ "orderable": false },
			{ "orderable": false },
		]
	});

	$('#studies_table_body').on( "click",'.text-danger', function(event) {
		event.preventDefault();
		var studyID = $(this).data("studyid");
		var title = $(this).data("title");
		bootbox.confirm({
				size: 'small',
				closeButton: false,
				message: "<b>Delete "+title+"?</b><br>This will delete all responses and associated data.",
				buttons: {confirm: {label: 'Delete Study',className: 'btn-danger'},
				cancel: {label: 'Cancel',className: 'btn-link'}
			},
			callback: function (result) {
				if(result){
					window.location.href = '/deletestudy/'+studyID
				}
			}
		});
	});

	$('#studies_table_body').on( "click",'.clear-responses', function(event) {
		event.preventDefault();
		var studyID = $(this).data("studyid");
		var title = $(this).data("title");
		bootbox.confirm({
				size: 'small',
				closeButton: false,
				message: "<b>Clear "+title+"?</b><br>This will clear all participant responses.",
				buttons: {confirm: {label: 'Clear',className: 'btn-danger'},
				cancel: {label: 'Cancel',className: 'btn-link'}
			},
			callback: function (result) {
				if(result){
					window.location.href = '/clearstudy/'+studyID
				}
			}
		});
	});
});

