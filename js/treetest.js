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

	$('#tree').treeview({
		data: getTree(),
		collapseIcon: "glyphicon glyphicon-menu-down",
		expandIcon:"glyphicon glyphicon-menu-right",
		selectedBackColor: "#808080",
	});

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
		list: [],
		idx: 0,
		add: function (taskStr) {
			this.list.push((this.list.length+1)+". "+taskStr)
			$('#taskList').append("<li>Task "+this.list.length+"</li>");
		},
		next:function() {
			this.idx = this.idx + 1; // increase i by one
		    this.idx = this.idx % this.list.length; // if we've gone too high, start from `0` again
		    $('#taskDesc').html(this.list[this.idx]);
		},
		prev:function() {
		    if (this.idx === 0) { // i would become 0
	    		this.idx = this.list.length; // so put it at the other end of the array
		    }
		    this.idx = this.idx - 1; // decrease by one
		    $('#taskDesc').html(this.list[this.idx]);
		}
	}

	
	tasks.add("Example task 1 find a new shopping bag.");
	tasks.add("Example task 2 find a new xbox bag.");
	tasks.add("Example task 3 find a new hourse.");


	$("#nextTaskButton" ).click(function() {
		tasks.next();
	});

	$("#prevTaskButton" ).click(function() {
		tasks.prev();
	});
	//click on task in task list ot navigate to task
	$('#taskList').click(function(event,data) {
		$('#taskDesc').html(tasks.list[$( "li" ).index(event.target)]);
	});

});

