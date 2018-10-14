
//--------------------Initialize Treeview Object---------------------
function bindNextButton(){
	$("#nextTaskButton" ).click(function() {
		if (!$('#nextTaskButton').hasClass('disabled')){
			tasks.next();
		}
	});
}
function initializeTreeViewObject(treeStructure){
	$('#tree').jstree({
		"core" : {
			"animation" : 0,
			"check_callback" : true,
			"themes" : { "stripes" : true, "variant": "large" },
			"data": JSON.parse(treeStructure)
		},
		"plugins" : [
	    "wholerow"
	  ]
	});

	$("#tree").on('ready.jstree', function() {
		$("#tree").jstree('close_all');
	});

	$('#tree').on("changed.jstree", function (e, data) {
		$("#tree").jstree("open_node", data.selected);
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
	//When node is selected (clicked), write full path of node ids
	$('#tree').on("select_node.jstree", function (e, data) {
	  tasks.answers[tasks.idx] = setHistory(data.node)
	  	enableButton('#nextTaskButton');
	});
	$('#tree').on("deselect_node.jstree", function (e, data) {
	  disableButton('#nextTaskButton');
	});
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
function setup(input_tasks,input_tree){
	var tasksDB = input_tasks.split(";").map(function(item) {
		  return item.trim();
	});
	for (var i = 0; i < tasksDB.length; i++) {
		if (tasksDB[i] != ''){
			tasks.add(tasksDB[i]);
		}
	}
	//create treeview structure from database information
	initializeTreeViewObject(input_tree);
	bindNodeSelection();
	$('#hiddenTasks').remove();
	$('#hiddenTree').remove();
	$('#treedata').remove();
	$('#hiddenSelectableParents').remove();
	$('#hiddenShowSiblings').remove();
	tasks.set(0);
	disableButton('#nextTaskButton');
	bindNextButton();
}
