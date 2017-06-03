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

	//not aplying to sub div. only parent div!
	createGroup = function(groupname){
		var group = $("<div class='group'></div>");
		var groupTitle =$("<div class='grouptitle' contenteditable='false'>Groupname</div>")
		var nestedArea = $("<div class='groupArea nested accepts-items'></div>");

		groupTitle.click(function(){
        	event.target.contentEditable=true;
			event.target.classList.add('contenteditable')
			this.focus();
			document.execCommand('selectAll', false, null);
    	});
		groupTitle.blur(function(){
        	event.target.contentEditable=false;
			event.target.classList.remove('contenteditable');
    	});

		//pressing enter doesn't create a newline just leaves edit mode
		groupTitle.keydown(function(event){
		    if(event.keyCode == 13){
        		event.target.contentEditable=false;
				event.target.classList.remove('contenteditable');
		    }
    	});

    	group.append(groupTitle);
    	group.append(nestedArea);

		$('#groupdrop').append(group);
		updateContainers();
	};

	//add add item button
	$('#siteHeader').append('<button id="addItemButton">Add Item</button>');
	//add add group button
	$('#siteHeader').append('<button id="newGroupButton">Add Group</button>');
	//add export to JSON button
	$('#siteHeader').append('<button id="exportJSONButton">Export JSON</button>');
	
	function setUpSecondaryPanels(){
		var numPanels = Math.round($(window).width()/200);
		for (var i = 0; i < numPanels; i++) {
			$('body').append('<div class="column-area-secondary accepts-groups nested"></div>');
		}
	}
	setUpSecondaryPanels();
	
	$('#newGroupButton').click(function() {createGroup("Group");});
	
	$('#addItemButton').click(function() {
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