$(document).ready(function() {
	var cs = {};
	cs.groupNum = 0;
	cs.zoneNum = 5;

 	function setLocationNewGroupButton(){
		$('#newGroupButton').remove();
		var next_idx = ((cs.zoneNum)+cs.groupNum)%cs.zoneNum;
		var newGroupButton = "<div id='newGroupButton'><i class='fa fa-plus' aria-hidden='true'></i>  New Group</div>";
		$('#dropZone'+next_idx).append(newGroupButton);
		$('#newGroupButton').click(function() {
			createGroup("New Group", true);
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
			var newName = $(event.target).text().trim()
			if (newName == ''){
				$(event.target).html("Default Group");
			} else {
				$(event.target).html(newName);
			}
        	event.target.contentEditable = false;
			event.target.classList.remove('contenteditable');
    	});
		groupTitle.keydown(function(event){
		    if(event.keyCode == 13){
				if ($(event.target).text().trim() == ''){
					$(event.target).html("Default Group");
				}
				$(event.target).blur();
		    }
    	});
		closeIcon.click(function(event){
        	deleteGroup($(event.target).parent());
    	});
		if (cs.studyType == 'open'){
			group.append(closeIcon);
			groupTitle.click(function(event){
	        	event.target.contentEditable = true;
				event.target.classList.add('contenteditable')
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
				results.push({groupname,cardname})
			});
		});
		results.unshift(Date())
		return results;
	}

	function loadDatafromDB(){
		cs.studyType = $('#hiddenType').val();
		cs.status = $('#hiddenActive').val();
		var groups = $('#hiddenGroups').val().split(";").map(function(item) {
			  return item.trim();
		});
		var cards = $('#hiddenCards').val().split(";").map(function(item) {
			  return item.trim();
		});
		for (var i = 0; i < groups.length; i++) {
			if (groups[i] != ''){
				createGroup(groups[i]);	
			}
		}
		for (var i = 0; i < cards.length; i++) {
			if (cards[i] != ''){
				createCard(cards[i]);
			}
		}

		if(cs.status == 'open'){
			//dragula event to check for empty intial list on 'drop' actions
			drake.on("drop", function(event){
				$('#hiddenResults').val(JSON.stringify(getResults()));
				if ($('#initialColumn').children().length == 0){
					$('#initialColumn').append("<input type='submit' id='done' class='btn btn-success btn-block' form='resultsForm' />");
				} else {
					$('#done').remove();
				}
			});
		}

		$('#hiddenGroups').remove();
		$('#hiddenCards').remove();
		$('#hiddenType').remove();
		$('#hiddenActive').remove();
	}

	loadDatafromDB();
});
