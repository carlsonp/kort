$(document).ready(function() {
	function getTree() {
	  var tree = [
		  {
		    text: "Parent 1",
		    nodes: [
		      {
		        text: "Child 1",
		        nodes: [
		          {
		            text: "Grandchild 1",
		          },
		          {
		            text: "Grandchild 2",
		          }
		        ]
		      },
		      {
		        text: "Child 2",
		      }
		    ]
		  },
		  {
		    text: "Parent 2",
		    checked: true,
		  },
		];

		function disableSelectableOnParents(tree) {
			for (var i = 0; i < tree.length; i++) { 
				if('nodes' in tree[i]){
					tree[i].selectable = false;	
					disableSelectableOnParents(tree[i].nodes);
				} 
			}	
		}
		disableSelectableOnParents(tree);

	  return tree;
	}

	$('#tree').treeview({data: getTree()});
	//Collapse All nodes by default 
	$('#tree').treeview('collapseAll', { silent: true });
	//Hide sibling nodes when node expands
	$('#tree').on('nodeExpanded', function(event, data) {
		var node = $('#tree').treeview('getNode', data.nodeId);
	  	var siblings = $('#tree').treeview('getSiblings', node);
	  	siblings.forEach(function(element) {
		    $('#tree').treeview('disableNode', [ element.nodeId, { silent: true } ]);
		});
	});
	//Show sibling nodes when node collapses
	$('#tree').on('nodeCollapsed', function(event, data) {
		var node = $('#tree').treeview('getNode', data.nodeId);
	  	var siblings = $('#tree').treeview('getSiblings', node);
	  	siblings.forEach(function(element) {
		    $('#tree').treeview('enableNode', [ element.nodeId, { silent: true } ]);
		});
	});
	//get all parent names from node (history)
	function getParent(node){
		var parent = $('#tree').treeview('getParent', node);
		if (parent.hasOwnProperty('text')){
			return getParent(parent)+"-"+parent.text;
		} else {
			return "root";	
		}
	}

	//When node is selected, write history to console
	$('#tree').on('nodeSelected', function(event, data) {
		var node = $('#tree').treeview('getNode', data.nodeId);
		console.log(getParent(node)+" | "+node.text);
	});

	var tasks = {
		list: ["1. This is the first task.",
				"2. This is the second task.",
				"3. This is the third task."],
		idx: 0,
	}

	$("#nextTaskButton" ).click(function() {
		tasks.idx = tasks.idx + 1; // increase i by one
	    tasks.idx = tasks.idx % tasks.list.length; // if we've gone too high, start from `0` again
	    $('#taskDesc').html(tasks.list[tasks.idx]);
	});

	$("#prevTaskButton" ).click(function() {
	    if (tasks.idx === 0) { // i would become 0
    		tasks.idx = tasks.list.length; // so put it at the other end of the array
	    }
	    tasks.idx = tasks.idx - 1; // decrease by one
	    $('#taskDesc').html(tasks.list[tasks.idx]);
	});

});