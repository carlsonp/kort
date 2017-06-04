$(document).ready(function() {
	//Slide out menu
	openMenu = function(){document.getElementById("mySidenav").style.width = "150px";}
	closeMenu = function(){document.getElementById("mySidenav").style.width = "0px";}
	$('#hamburger').click(function(){openMenu();});
	$('#closeMenu').click(function(){closeMenu();});

	//Dragula initialization
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

	deleteGroup = function(group){
		//return items to initial area
		var nestedArea = group.children()[group.children().length-1]
		var items = $(nestedArea).children()
		items.each(function() {
			$('#initialColumn').append(this);
		});
		//remove group div
		$(group).attr("id","toBeDeleted")
		$('#toBeDeleted').fadeOut("fast","swing",function() {$(this).remove();});
	}

	
	createGroup = function(groupname){
		var group = $("<div class='group' hidden></div>");
		var groupTitle = $("<div class='title' contenteditable='false'>Groupname</div>")
		var closeIcon = $("<i class='fa fa-times closeicon' aria-hidden='true'></i>")
		var nestedArea = $("<div class='droparea nested accepts-items'></div>");
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
		closeIcon.click(function(event){
			var groupElement = $(event.target).parent();
        	deleteGroup(groupElement);
    	});

    	group.append(closeIcon);
    	group.append(groupTitle);
    	group.append(nestedArea);
		$('#groupdrop').append(group)
		group.fadeIn();
		updateContainers();
	};

	//setup initial drop zones for groups
	(function (){
		for (var i = 0; i < 3; i++) {
			$('body').append('<div class="column-area-secondary accepts-groups nested"></div>');
		}
	})();
	
	$('#newGroupButton').click(function() {createGroup("Group");});
	
	$('#addItem').click(function() {
		var itemName = prompt("Please enter item name:", "");
		var newElement = $('<div class="item">'+itemName+'</div>');
		$('#initialColumn').append(newElement);
		updateContainers();
		closeMenu();
	});

	$('#exportJSON').click(function() {
		var JSONExport = new Object();
		drake.containers.forEach(function (item) {
		  var children = $('#'+item.id).children();
		  JSONExport[item.id] = [];
		  for (var i = 0; i < children.length; i++) {
			JSONExport[item.id].push(children[i].innerHTML);
		  }
		})
		console.log(JSON.stringify(JSONExport));
		closeMenu();
	});
});