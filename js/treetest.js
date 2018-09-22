$(document).ready(function() {
	//--------------------Initialize Treeview Object---------------------
	function createTreeViewStructure(){
		function addNodeByPath(myroot,path){
			if (path.length == 1){
				myroot.children.push({text: path[0], state: {disabled: false}, children: []})
			} else {
				var next = path.shift();
				for (var i = 0; i < myroot.children.length; i++) {
					if (myroot.children[i].text == next){
						addNodeByPath(myroot.children[i],path)
					}
				}
			}
		}
		function removeEmptyLists(myroot){
			for (var i = 0; i < myroot.children.length; i++) {
				if (myroot.children[i].children.length == 0){
					delete myroot.children[i].children
				} else {
					removeEmptyLists(myroot.children[i])
				}
			}
		}   
		function makeTree(myroot){
			var newTree = [];
			for (var i = 0; i < root.children.length; i++) {
			  newTree.push(root.children[i]);
			}
			return newTree;
		}

		var root = {text: 'root', children: []}
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
		$('#tree').jstree({
			"core" : {
				"animation" : 0,
				"check_callback" : true,
				"themes" : { "stripes" : true },
				"data": treeStructure,		
			}
		});
	}
	//--------------------Treeview Event Handlers---------------------
	function bindToHideSiblings(){
		//Hide sibling nodes when node expands
		open_node.jstree
		$('#tree').on('open_node.jstree', function(e, data) {
			var node = data.node
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

	function enableButton(buttonID){
		$(buttonID).removeClass('disabled');
		$(buttonID).addClass('btn-amber');
	}

	function disableButton(buttonID){
		$(buttonID).removeClass('btn-amber');
		$(buttonID).addClass('disabled');
	}	
	function bindNodeSelection(){
		console.log("here")
		//When node is selected (clicked), write full path of node ids
		$('#tree').on("select_node.jstree", function (e, data) {
		  tasks.answers[tasks.idx] = setHistory(data.node)
		  	enableButton('#nextTaskButton');
		});
		$('#tree').on("deselect_node.jstree", function (e, data) {
		  disableButton('#nextTaskButton');
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
		$('#tree').jstree('close_all');
		disableButton('#nextTaskButton');
	}
	function setHistory(node){
		var path = $('#tree').jstree('get_path',node);
		return path;
	}
	function disableSelectableOnParents(tree) {
		for (var i = 0; i < Object.keys(tree).length; i++) { 
			if('children' in tree[i]){
				tree[i].state.disabled = true;
				disableSelectableOnParents(tree[i].children);
			} 
		}	
	}
	function getAllHistoryAsText(){
		var textAnswers = [];
		for (var i = 0; i < tasks.answers.length; i++) {
			var taskNodeIds = tasks.answers[i];
			var textTask = [];
			for (var j = 0; j < taskNodeIds.length; j++) {
				var node = $('#tree').treeview('get_node', taskNodeIds[j]);
				textTask.push(node.text);
			}
			textAnswers.push(textTask)
		}
		return textAnswers;
	}
	function updateProgressBar(){
		var status = ((tasks.idx/tasks.list.length)*100)+'%';
		$('#progressbar').css("width", status);
		$('#progressbar').html('');
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
		},
		next:function() {
			if (!(this.idx == this.list.length-1)){
				this.idx = this.idx + 1; 
				this.set(this.idx);
				updateProgressBar();
			} else {				
				$('#hiddenResults').val(JSON.stringify(tasks.answers));
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
		if($('#hiddenSelectableParents').val() != 'on'){
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
	disableButton('#nextTaskButton');
	//-----------------------------Task List-----------------------------
	$("#nextTaskButton" ).click(function() {
		if (!$('#nextTaskButton').hasClass('disabled')){
			tasks.next();	
		}
	});
});

