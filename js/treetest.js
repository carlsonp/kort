$(document).ready(function() {
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
	
	function addNodeByPath(myroot,path){
		if (path.length == 1){
			myroot.nodes.push({text: path[0], nodes: []})
		} else {
			var next = path.shift();
			for (var i = 0; i < myroot.nodes.length; i++) {
				if (myroot.nodes[i].text == next){
					addNodeByPath(myroot.nodes[i],path)
				}
			}
		}
	}
	function removeEmptyLists(myroot){
		for (var i = 0; i < myroot.nodes.length; i++) {
			if (myroot.nodes[i].nodes.length == 0){
				delete myroot.nodes[i].nodes
			} else {
				removeEmptyLists(myroot.nodes[i])
			}
		}
	}   
	function makeTree(myroot){
		var newTree = [];
		for (var i = 0; i < root.nodes.length; i++) {
		  newTree.push(root.nodes[i]);
		}
		return newTree;
	}
	var root = {text: 'root', nodes: []}
	addNodeByPath(root,['Ducks'])
	addNodeByPath(root,['Ducks','Cats'])
	addNodeByPath(root,['Ducks','Cats','Beavers'])
	addNodeByPath(root,['Ducks','Cats','Grandchild-2'])
	addNodeByPath(root,['Ducks','Child-2'])
	addNodeByPath(root,['Parent-2'])
	removeEmptyLists(root)
	var myTree = makeTree(root)

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

	//--------------------Initialize Treeview Object---------------------
	disableSelectableOnParents(myTree);
	//create treeview object
	$('#tree').treeview({
		data: myTree,
		collapseIcon: "glyphicon glyphicon-menu-down",
		expandIcon:"glyphicon glyphicon-menu-right",
		selectedBackColor: "#009ec3",
	});
	resetTree();

	//--------------------Treeview Event Handlers---------------------
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
	//When node is selected (clicked), write full path of node ids
	$('#tree').on('nodeSelected', function(event, data) {
		var node = $('#tree').treeview('getNode', data.nodeId);
		tasks.answers[tasks.idx] = setHistory(node).concat([node.nodeId]); 
		DOMnode = $('#taskList li').get(tasks.idx) 
		$(DOMnode).addClass("checked");
	});
	$('#fileInputButton').click(function(){
		document.getElementById('fileInput').click();
	});
	//--------------------Treeview Functions (manual)--------------------
	function expandToNode(history){
		if(history.length > 1){
			thisNodeId = history.shift(); 
			$('#tree').treeview('expandNode', [ thisNodeId, {silent: true } ]);
			var siblings = $('#tree').treeview('getSiblings', thisNodeId);
	  		siblings.forEach(function(sibling) {
		    	$('#tree').treeview('disableNode', [ sibling.nodeId, { silent: true } ]);
			});
			expandToNode(history);
		} else {
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
		});
	}
	//get all parent ids from node and concat them in a single array recursively(history)
	function setHistory(node){
		var parent = $('#tree').treeview('getParent', node);
		if (parent.hasOwnProperty('text')){
			return setHistory(parent).concat([parent.nodeId]);
		} else {
			return [];	
		}
	}
	function disableSelectableOnParents(tree) {
		for (var i = 0; i < tree.length; i++) { 
			if('nodes' in tree[i]){
				tree[i].selectable = false;	
				disableSelectableOnParents(tree[i].nodes);
			} 
		}	
	}
	//--------------------------Task JS Object---------------------------
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
			this.idx = this.idx + 1; 
		    this.idx = this.idx % this.list.length;
		    this.set(this.idx);
		},
		prev:function() {
		    if (this.idx === 0) {
	    		this.idx = this.list.length;
		    }
		    this.idx = this.idx - 1;
		    this.set(this.idx);
		},
		set:function(number){
			this.idx = number; 
			$('#taskDesc').html(this.list[number]);
			$('#taskList li').removeClass('selected');
			DOMnode = $('#taskList li').get(this.idx) 
			$(DOMnode).addClass("selected");
			//if the selected task has already been 
			//  completed load the answer from the tasks obj
			resetTree();
			if(this.answers[this.idx].length > 0){
				//need to pass a copy of node path to expandToNode (or else it alters tasks.answers)
				var copyOfHistory = $.extend(true, [], this.answers[this.idx]);
				expandToNode(copyOfHistory);
			}
		}
	}
	//---------------------Task List Initialization----------------------
	//adding tasks manually - for testing only
	tasks.add("1. Sample Task");
	tasks.add("2. Sample Task");
	tasks.add("3. Sample Task");
	tasks.set(0);
	//-----------------------------Task List-----------------------------
	$("#nextTaskButton" ).click(function() {tasks.next();});
	$("#prevTaskButton" ).click(function() {tasks.prev();});
	//click on task in task list ot navigate to task
	$('#taskList').click(function(event,data) {
		tasks.set($("li").index(event.target));
	});
	//------------------------------File IO------------------------------

  // console.log(myTree)
	//-------------------------------------------------------------------
});

