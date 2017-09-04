$(document).ready(function() {
	$('#results_table').DataTable({
		dom: 'Bfrtip',
		bPaginate: false,
		bInfo: false,
	  	scrollY:        "500px",
        scrollCollapse: true,
        paging:         false,
		language: {
	        search: "Filter"
	    },
		buttons: [
			{ extend: 'csvHtml5', text: 'Download CSV' },
			{ extend: 'copy', text: 'Copy'}
		],
		"columns": [
			null,
			null,
			null,
			{ "orderable": false },
			{ "orderable": false },
			{ "orderable": false },
			{ "orderable": false },
			{ "orderable": false },
		]
	});

	$('#words_table').DataTable({
			dom: 'Bfrtip',
			bPaginate: false,
			bInfo: false,
		  	scrollY:        "500px",
	        scrollCollapse: true,
	        paging:         false,
			language: {
		        search: "Filter"
		    },
			buttons: [
				{ extend: 'csvHtml5', text: 'Download CSV'},
				{ extend: 'copy', text: 'Copy'}
			],
		});
});