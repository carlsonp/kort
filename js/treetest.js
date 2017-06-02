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

	//create treeview object
	$('#tree').treeview({
		data: getTree(),
		collapseIcon: "glyphicon glyphicon-menu-down",
		expandIcon:"glyphicon glyphicon-menu-right",
		selectedBackColor: "#808080",
	});
	resetTree();

	//Event handler: Hide sibling nodes when node expands
	$('#tree').on('nodeExpanded', function(event, data) {
		var node = $('#tree').treeview('getNode', data.nodeId);
	  	var siblings = $('#tree').treeview('getSiblings', node);
	  	siblings.forEach(function(element) {
		    $('#tree').treeview('disableNode', [ element.nodeId, { silent: true } ]);
		});
	});

	//Event Handler: Show sibling nodes when node collapses
	$('#tree').on('nodeCollapsed', function(event, data) {
		var node = $('#tree').treeview('getNode', data.nodeId);
	  	var siblings = $('#tree').treeview('getSiblings', node);
	  	siblings.forEach(function(element) {
		    $('#tree').treeview('enableNode', [ element.nodeId, { silent: true } ]);
		});
	});

	//get all parent ids from node and concat them in a single array recursively(history)
	function setHistory(node){
		var parent = $('#tree').treeview('getParent', node);
		if (parent.hasOwnProperty('text')){
			return setHistory(parent).concat([parent.nodeId]);
		} else {
			return [];	
		}
	}

	function expandToNode(history){
		if(history.length > 1){
			thisNodeId = history.shift(); //expand first element of history
			$('#tree').treeview('expandNode', [ thisNodeId, {silent: true } ]);
			//get siblings of epxanded node and hide them
			var siblings = $('#tree').treeview('getSiblings', thisNodeId);
	  		siblings.forEach(function(sibling) {
		    	$('#tree').treeview('disableNode', [ sibling.nodeId, { silent: true } ]);
			});
			expandToNode(history); //recurse on the rest of the history list
		} else {
			//select last item in history list (item that was selected)
			$('#tree').treeview('selectNode', [ history.shift(), { silent: true } ]);
		}
	}

	//collapse and show all nodes, deselect all
	function resetTree(){
		$('#tree').treeview('collapseAll', { silent: true });
		$('#tree').treeview('enableAll', { silent: true });
		var selectedNodes = $('#tree').treeview('getSelected');
		selectedNodes.forEach(function(element){
			$('#tree').treeview('toggleNodeSelected', [ element.nodeId, { silent: true } ]);
		})
	}

	//Event Handler: When node is selected (clicked), write full path from root
	$('#tree').on('nodeSelected', function(event, data) {
		var node = $('#tree').treeview('getNode', data.nodeId);
		tasks.answers[tasks.idx] = setHistory(node).concat([node.nodeId]); //set navigation histor in tasks.answers
		DOMnode = $('#taskList li').get(tasks.idx) //add css for selected task in navigation
		$(DOMnode).addClass("checked");
	});
	
	//tasks js object to store task related functions and data
	var tasks = {
		list: [], //task descriptions
		answers: [], //full path of nodeIds when answer is selected
		idx: 0,
		add: function (taskStr) {
			this.list.push(taskStr);
			this.answers.push(false);
			$('#taskList').append("<li>Task "+this.list.length+"</li>");
		},
		next:function() {
			this.idx = this.idx + 1; // increase i by one
		    this.idx = this.idx % this.list.length; // if we've gone too high, start from `0` again
		    this.set(this.idx);
		},
		prev:function() {
		    if (this.idx === 0) { // i would become 0
	    		this.idx = this.list.length; // so put it at the other end of the array
		    }
		    this.idx = this.idx - 1; // decrease by one
		    this.set(this.idx);
		},
		set:function(number){
			this.idx = number; //update the task number in the tasks object
			$('#taskDesc').html(this.list[number]);//set the task description to be the content of the task
			$('#taskList li').removeClass('selected');//remove 'selected' class from each navigation task option
			DOMnode = $('#taskList li').get(this.idx)//get the currently selected node 
			$(DOMnode).addClass("selected");//add class to show as selected
			//if the selected task has already been completed load the answer from the tasks obj
			if(this.answers[this.idx]){
				resetTree(); //resets the tree
				expandToNode(this.answers[this.idx]);
			} else {
				resetTree();
			}
		}
	}

	//adding tasks manually - for testing only
	tasks.add("1. Sample Task");
	tasks.add("2. Sample Task");
	tasks.add("3. Sample Task");

	$("#nextTaskButton" ).click(function() {
		tasks.next();
		console.log(JSON.stringify(tasks));
	});

	$("#prevTaskButton" ).click(function() {
		tasks.prev();
	});

	//click on task in task list ot navigate to task
	$('#taskList').click(function(event,data) {
		tasks.set($("li").index(event.target));
	});

  	function addTasksFromFile(filetext){
	    arr = filetext.split("\n");
	    for (var i = 0; i < arr.length; i++) {
    		tasks.add(arr[i]);
		}
		tasks.set(0);

	}

  	function readInTextFile(tasksOrTree){  
		var file = $('#fileInput').prop('files')[0];
		if (file.type.match(/text.*/)) {
			var reader = new FileReader();
			reader.onload = function() {
				if(tasksOrTree === "tree"){
					//do tree stuff
				} else {
					addTasksFromFile(reader.result);		
				}
			}
			reader.readAsText(file);  
		}
	}

	$('#fileInput').change(function(){
		readInTextFile("tasks");
	});
});

