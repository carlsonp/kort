function init_jsTree(treedata){
	$('#tree').jstree({
	  "core" : {
	    "animation" : 0,
	    "check_callback" : true,
	    "themes" : { "stripes" : true },
	    'data' : treedata
	  },
	  "plugins" : [
	    "contextmenu", "dnd", "search",
	    "state"
	  ]
	});
	bindFunctions();
}

function bindFunctions(){
	$("#submitBtn").click(function() {
	  	var treedata = JSON.stringify($('#tree').jstree(true).get_json('#', {flat:true}));
    	$('#treedata').val(treedata);
    	$('#form').submit()
	});

    $("#createNewRootNode").click(function() {
	  	$('#tree').jstree().create_node("#" ,  "New Root Item", "last");
	});

	//expand parent node when child is created
    $("#createNewNode").click(function() {
	  	var selectedParent = $("#tree").jstree("get_selected");
	  	$('#tree').jstree().create_node(selectedParent ,  "New Item", "last");
	  	$("#tree").jstree("open_node", selectedParent);
	});

    $("#expandAll").click(function() {
    	$("#tree").jstree('open_all');
	});
}