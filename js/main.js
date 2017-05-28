$(document).ready(function() {
	var drake = dragula({
		copy: false,
		accepts: function(el, target) {
		  return  !el.classList.contains('no-dnd')
		},
		moves: function(el, container, handle) {
			return  !el.classList.contains('no-dnd')
		}
	});
	drake.containers.push(document.querySelector('#left'));
	drake.containers.push(document.querySelector('#right'));
	
	createGroup = function(groupname){
		var newElement = $("<div id='"+groupname+"' class='floating-box-right container'><div class='groupTitle no-dnd'>"+groupname+"</div></div>");
		$('.content-area').append(newElement);
		drake.containers.push(document.querySelector("#"+newElement.attr("id")));
	};

	
	createDefaultGroups = function() {
		for (var i = 1; i < 13; i++) {
				createGroup("Group_"+i);
		}	
	}
	createDefaultGroups();



	$('#newGroupButton').click(function() {
		var groupname = prompt("Please enter group name:", "");
		if (groupname != null || groupname != "") {
			createGroup(groupname);
		}
	});

	createGroup("Group_1");

	$('#newColumnButton').click(function() {
		var newElement = $('<div class="column-area nested"></div>');
		newElement.uniqueId();
		$('.content-area').append(newElement);
		updateContainers();
	});

	$('#newItemButton').click(function() {
		var itemName = prompt("Please enter item name:", "");
		var newElement = $('<div class="item">'+itemName+'<div class="nested item-nested"></div></div>');
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