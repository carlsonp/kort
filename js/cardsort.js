$(document).ready(function() {
	var drake = dragula([].slice.apply(document.querySelectorAll('.nested')),{
		copy: false,
		accepts: function (el, target, source, sibling) {
			if(el.classList.contains('item') && target.classList.contains('accepts-items')){
				return true;
			} else if (el.classList.contains('group') && target.classList.contains('accepts-groups')){
				return true;
			} else {
				return false;	
			}
		},
		moves: function(el, container, handle) {
			return  !el.classList.contains('no-dnd')
		},
	});
	
	updateContainers = function(){
		drake.containers = [].slice.apply(document.querySelectorAll('.nested'))
	}

	createGroup = function(groupname){
		var newElement = $('<div class="group">'+groupname+'<div class="nested accepts-items"></div></div>');
		$('#groupdrop').append(newElement);
		updateContainers();
	};
	
	$('#newGroupButton').click(function() {
		var groupname = prompt("Please enter group name:", "");
		if (groupname != null || groupname != "") {
			createGroup(groupname);
		}
	});

	//createGroup("Group_1");

	$('#newItemButton').click(function() {
		var itemName = prompt("Please enter item name:", "");
		var newElement = $('<div class="item">'+itemName+'<div class="nested item-nested"></div></div>');
		$('#initialColumn').append(newElement);
		updateContainers();
	});
	$('#newBasicItemButton').click(function() {
		var itemName = prompt("Please enter item name:", "");
		var newElement = $('<div class="item">'+itemName+'</div>');
		$('#initialColumn').append(newElement);
		updateContainers();
	});

	$('#exportJSONButton').click(function() {
		var JSONExport = new Object();
		drake.containers.forEach(function (item) {
		  var children = $('#'+item.id).children();
		  JSONExport[item.id] = [];
		  for (var i = 0; i < children.length; i++) {
			JSONExport[item.id].push(children[i].innerHTML);
		  }
		})
		console.log(JSON.stringify(JSONExport));
	});
});