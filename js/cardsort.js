$(document).ready(function() {
	var cs = {};
	cs.groupNum = 0;
	cs.zoneNum = 5;

	function readInResults(){
		for (var i = 0; i < stuff.length; i++) {
			console.log(stuff[i].groupname+': ------');
			for (var j = 0; j < stuff[i].cards.length; j++) {
				console.log(stuff[i].cards[j]);
			}
		}
	}

	function updateGroupArray(){
		cs.groups = [];
		$('.group').each(function(index) {
			var title = $(this).children('.title')
			cs.groups.push(title.text());
		});
	}
	
 	function setLocationNewGroupButton(){
		$('#newGroupButton').remove();
		var next_idx = ((cs.zoneNum)+cs.groupNum)%cs.zoneNum;
		var newGroupButton = "<div id='newGroupButton'><i class='fa fa-plus' aria-hidden='true'></i>  New Group</div>";
		$('#dropZone'+next_idx).append(newGroupButton);
		$('#newGroupButton').click(function() {
			for (var i = 1; i < 1000; i++) {
				var newName = "Group "+i;
				if (!groupNameExists(newName)){
					createGroup(newName, true);
					break;
				} 
			}
		});
	}
	
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

	function groupNameExists(groupname){
		if (cs.groups && cs.groups.indexOf(groupname) !== -1){
			return true;
		} else {
			return false;
		}
	}

	function updateContainers(){
		drake.containers = [].slice.apply(document.querySelectorAll('.nested'))
	}

	function deleteGroup(group){
		cs.groupNum-=1;
		//get droparea div and put all items back to init column
		$(group).children('.droparea').children().each(function() {
			$('#initialColumn').append(this);
		});
		//remove group div
		$(group).fadeOut("fast","swing", function() {
			$(this).remove();
		});
		setLocationNewGroupButton();
		updateGroupArray();
	}

	function createGroup(groupname, focus_on_creation = false){
		cs.groupNum+=1;
		if (cs.studyType == 'open'){
			setLocationNewGroupButton();
		}
		var group = $("<div class='group' hidden></div>");
		var groupTitle = $("<div class='title' contenteditable='false'>"+groupname+"</div>");
		var closeIcon = $("<i class='fa fa-times closeicon' aria-hidden='true'></i>");
		var nestedArea = $("<div class='droparea nested accepts-items'></div>");
		var grabIcon = $("<div class='iconContainer'><i class='fa fa-ellipsis-h grabicon' aria-hidden='true'></i></div>");
		
		groupTitle.blur(function(event){
			//helper function for blur event

			var title = event.target;
			var newName = $(title).text().trim();	
			if (cs.lastChanged != newName){
				if (newName == ''){
					$(title).html('Default Group');
				} else {
					if (!groupNameExists(newName)){
						$(title).html(newName);
					} else {
						alert('group name already exists');
						$(title).html(cs.lastChanged);
					}
				}
			} 
        	title.contentEditable = false;
			title.classList.remove('contenteditable');
			updateGroupArray();
    	});
		//if the enter key is pressed, call the blur event
		groupTitle.keydown(function(event){
		    if(event.keyCode == 13){
				$(event.target).blur();
		    }
    	});

		if (cs.studyType == 'open'){
			group.append(closeIcon);
			closeIcon.click(function(event){
    	    	deleteGroup($(event.target).parent());
    		});

			groupTitle.click(function(event){
				var title = event.target;
	        	cs.lastChanged = $(title).text();
	        	title.contentEditable = true;
				title.classList.add('contenteditable')
				this.focus();
				document.execCommand('selectAll', false, null);
	    	});
		}
    	group.append(groupTitle);
    	group.append(nestedArea);
    	group.append(grabIcon);
		$('#dropZone'+((cs.zoneNum-1)+cs.groupNum)%cs.zoneNum).append(group)
		
		if (focus_on_creation) {
			group.fadeIn();
			groupTitle.click()	
		}

		updateContainers();
		updateGroupArray();
	}

	function createCard(cardName){
		$('#initialColumn').append('<div class="item">'+cardName+'</div>');
		updateContainers()
	}

	function getResults(){
		var results = []
		$('.group').each(function(index) {
			var title = $(this).children('.title')
			var groupname = $(title).text();
			var nestedArea = $(this).children('.droparea')
			var cards = []
			$(nestedArea).children().each(function(){
				var cardname = $(this).text();
				cards.push(cardname);
			});
			results.push({groupname,cards})
		});
		return results;
	}

	function loadDatafromDB(){
		cs.studyType = $('#hiddenType').val();
		cs.status = $('#hiddenActive').val();
		cs.responseID = $('#resid').val();

		if(cs.studyType == 'closed'){
			var groups = $('#hiddenGroups').val().split(";").map(function(item) {
			  return item.trim();
			});
			for (var i = 0; i < groups.length; i++) {
				if (groups[i] != ''){
					createGroup(groups[i]);	
				}
			}
		}
		setLocationNewGroupButton();
		var cards = $('#hiddenCards').val().split(";").map(function(item) {
			  return item.trim();
		});
		for (var i = 0; i < cards.length; i++) {
			if (cards[i] != ''){
				createCard(cards[i]);
			}
		}

		if(cs.status == 'open'){
			//dragula event to check for empty intial list on 'drop' actions
			drake.on("drop", function(event){
				$('#hiddenResults').val(JSON.stringify(getResults()));
				if (($('#initialColumn').children().length == 1) && (cs.responseID != 'preview')){
					$('#done').show();
				} else {
					$('#done').hide();
				}
			});
		}
		$('#done').hide();

		$('#hiddenGroups').remove();
		$('#hiddenCards').remove();
		$('#hiddenType').remove();
		$('#hiddenActive').remove();
	}

	loadDatafromDB();
});
