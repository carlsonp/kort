$(document).ready(function() {
	//--------------------Initialize Treeview Object---------------------
	function createTreeViewStructure(){
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
		var nodes = $('#hiddenTree').val().split(";").map(function(item) {
			  return item.trim();
		});
		for (var i = 0; i < nodes.length; i++) {
			var nodepath = nodes[i].split("/").map(function(item) {
			  return item.trim();
			}).filter(function(n){ return n != '' });
			addNodeByPath(root,nodepath);
		}
		removeEmptyLists(root)
		var myTree = makeTree(root)
		return myTree;
	}
	
	function initializeTreeViewObject(treeStructure){
		$('#tree').treeview({
			data: treeStructure,
			collapseIcon: "glyphicon glyphicon-menu-down",
			expandIcon:"glyphicon glyphicon-menu-right",
			selectedBackColor: "gray",
			onhoverColor: "white",
			borderColor: 'lightgray',
		});
		resetTree();
	}

	//--------------------Treeview Event Handlers---------------------
	function bindToHideSiblings(){
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
	}
	function bindNodeSelection(){
		//When node is selected (clicked), write full path of node ids
		$('#tree').on('nodeSelected', function(event, data) {
			var node = $('#tree').treeview('getNode', data.nodeId);
			tasks.answers[tasks.idx] = setHistory(node).concat([node.nodeId]); 
			$('#nextTaskButton').removeClass('disabled')
		});

		$('#tree').on('nodeUnselected', function(event, data) {
			$('#nextTaskButton').addClass('disabled')
		});
	}
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
	function resetTree(){
		$('#tree').treeview('collapseAll', { silent: true });
		$('#tree').treeview('enableAll', { silent: true });
		var selectedNodes = $('#tree').treeview('getSelected');
		selectedNodes.forEach(function(element){
			$('#tree').treeview('toggleNodeSelected', [ element.nodeId, { silent: true } ]);
		});
		$('#nextTaskButton').addClass('disabled');
	}
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

	function getAllHistoryAsText(){
		var textAnswers = [];
		for (var i = 0; i < tasks.answers.length; i++) {
			var taskNodeIds = tasks.answers[i];
			var textTask = [];
			for (var j = 0; j < taskNodeIds.length; j++) {
				var node = $('#tree').treeview('getNode', taskNodeIds[j]);
				textTask.push(taskNodeIds[j],node.text);
			}
			textAnswers.push(textTask)
		}
		return textAnswers;
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
			// $('#taskList').append("<li>Task "+this.list.length+"</li>");
		},
		next:function() {
			if (!(this.idx == this.list.length-1)){
				this.idx = this.idx + 1; 
				this.set(this.idx);
			} else {				
				$('#hiddenResults').val(JSON.stringify(getAllHistoryAsText()));
				console.log(JSON.stringify(getAllHistoryAsText()))
				$('#submitForm').click();
			}
			if (this.idx == this.list.length-1){
				$('#nextTaskButton').html('Finish')
			}
			
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
			$('#taskNum').html("Task "+(number+1)+" of "+this.list.length);
			resetTree();
			if(this.answers[this.idx].length > 0){
				//need to pass a copy of node path to expandToNode (or else it alters tasks.answers)
				var copyOfHistory = $.extend(true, [], this.answers[this.idx]);
				expandToNode(copyOfHistory);
			}
		}
	}
	//---------------------Task List Initialization----------------------
	function loadDatafromDB(){
		var tasksDB = $('#hiddenTasks').val().split(";").map(function(item) {
			  return item.trim();
		});
		for (var i = 0; i < tasksDB.length; i++) {
			if (tasksDB[i] != ''){
				tasks.add(tasksDB[i]);	
			}
		}
		//create treeview structure from database information
		var myTree = createTreeViewStructure()
		//parents are selectable by default, only disable when value is false
		if(!$('#hiddenSelectableParents').val()){
			disableSelectableOnParents(myTree);
		}
		initializeTreeViewObject(myTree);
		bindNodeSelection();
		//initialize treeview event after treeview object created
		if($('#hiddenShowSiblings').val()){
			bindToHideSiblings()
		}
		$('#hiddenTasks').remove();
		$('#hiddenTree').remove();
		$('#hiddenSelectableParents').remove();
		$('#hiddenShowSiblings').remove();
	}
	loadDatafromDB();
	tasks.set(0);
	$('#nextTaskButton').addClass('disabled')
	//-----------------------------Task List-----------------------------
	$("#nextTaskButton" ).click(function() {
		if (!$('#nextTaskButton').hasClass('disabled')){
			tasks.next();	
		}
	});
});

