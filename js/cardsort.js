$(document).ready(function() {
	
	var groupsArray = [];
	var cardsArray = [];
	//Slide out menu
	function openMenu(){document.getElementById("mySidenav").style.width = "450px";}
	function closeMenu(){document.getElementById("mySidenav").style.width = "0px";}
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
	
	function updateContainers(){
		drake.containers = [].slice.apply(document.querySelectorAll('.nested'))
	}

	function deleteGroup(group){
		//return items to initial area
		var nestedArea = group.children()[group.children().length-2]
		var items = $(nestedArea).children()
		items.each(function() {
			$('#initialColumn').append(this);
		});
		//remove group div
		$(group).attr("id","toBeDeleted")
		$('#toBeDeleted').fadeOut("fast","swing",function() {$(this).remove();});
	}

	function createGroup(groupname){
		var group = $("<div class='group' hidden></div>");
		var groupTitle = $("<div class='title' contenteditable='false'>"+groupname+"</div>");
		var closeIcon = $("<i class='fa fa-times closeicon' aria-hidden='true'></i>");
		var nestedArea = $("<div class='droparea nested accepts-items accepts-groups'></div>");
		var grabIcon = $("<div class='iconContainer'><i class='fa fa-ellipsis-h grabicon' aria-hidden='true'></i></div>");
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
    	group.append(grabIcon);
		$('#groupdrop').append(group)
		group.fadeIn();
		updateContainers();
	};

	function createGroups(groupArr){
		for (var i = 0; i < groupArr.length; i++) {
			createGroup(groupArr[i]);
		}
	}

	function createCard(cardName){
		var newElement = $('<div class="item">'+cardName+'</div>');
		$('#initialColumn').append(newElement);
		updateContainers();
	}
	
	function setUpDropZones(){
		for (var i = 0; i < 3; i++) {
			console.log("here")
			$('body').append('<div class="column-area-secondary accepts-groups nested"></div>');
		}
	}

	//drop zones for groups need to be created before default groups
	setUpDropZones();
	// createGroups(['Group1','Group2','Group 3','Group 4']);
	
	$('#addCardsButton').click(function() {
		var strArray = $('#cardsList').val().split("\n");
		for (var i = 0; i < strArray.length; i++) {
			if(strArray[i] != ''){
				createCard(strArray[i]);
			}
		}
	});
	$('#addGroupsButton').click(function() {
		var strArray = $('#groupsList').val().split("\n");
		for (var i = 0; i < strArray.length; i++) {
			createGroup(strArray[i]);
		}
	});

	$('#newGroupButton').click(function() {
		createGroup("Group");
	});
	
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