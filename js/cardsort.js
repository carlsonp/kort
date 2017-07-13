$(document).ready(function() {
	var groupNum = 0;
	var zoneNum = 5;
	var studyIsOpen = false;

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
		groupNum-=1;
		var nestedArea = group.children()[group.children().length-2]
		var items = $(nestedArea).children()
		items.each(function() {
			$('#initialColumn').append(this);
		});
		$(group).attr("id","toBeDeleted")
		$('#toBeDeleted').fadeOut("fast","swing",function() {$(this).remove();});
	}

	function createGroup(groupname){
		groupNum+=1;
		var group = $("<div class='group' hidden></div>");
		var groupTitle = $("<div class='title' contenteditable='false'>"+groupname+"</div>");
		var closeIcon = $("<i class='fa fa-times closeicon' aria-hidden='true'></i>");
		var nestedArea = $("<div class='droparea nested accepts-items'></div>");
		var grabIcon = $("<div class='iconContainer'><i class='fa fa-ellipsis-h grabicon' aria-hidden='true'></i></div>");
		
		groupTitle.blur(function(event){
			var newName = $(event.target).html();
			console.log(newName)
			if (newName == '' || newName == '<br>'){
				$(event.target).html("Default Group");
			}
        	event.target.contentEditable=false;
			event.target.classList.remove('contenteditable');
    	});
		//pressing enter doesn't create a newline just leaves edit mode
		groupTitle.keydown(function(event){
		    if(event.keyCode == 13){
		    	var newName = $(event.target).html();
				console.log(newName)
				if (newName == '' || newName == '<br>'){
					$(event.target).html("Default Group");
				}
        		event.target.contentEditable=false;
				event.target.classList.remove('contenteditable');
		    }
    	});
		closeIcon.click(function(event){
			var groupElement = $(event.target).parent();
        	deleteGroup(groupElement);
    	});
		if (studyIsOpen){
			group.append(closeIcon);
			groupTitle.click(function(event){
	        	event.target.contentEditable=true;
				event.target.classList.add('contenteditable')
				this.focus();
				document.execCommand('selectAll', false, null);
	    	});
		}
    	group.append(groupTitle);
    	group.append(nestedArea);
    	group.append(grabIcon);
		$('#dropZone'+((zoneNum-1)+groupNum)%zoneNum).append(group)
		group.fadeIn();
		updateContainers();
	}

	function createCard(cardName){
		var newElement = $('<div class="item">'+cardName+'</div>');
		$('#initialColumn').append(newElement);
		updateContainers();
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
		if ($('#hiddenType').val() == 'open'){
			$('#cardsort-navbar').append("<li><a href='#' id='newGroupButton'>New Group</a></li>")
			studyIsOpen = true;
			$('#newGroupButton').click(function() {
				createGroup("New Group");
			});
		}
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

		//only bind if active
		if($('#hiddenActive').val() === 'true'){
			//dragula event to check for empty intial list on 'drop' actions
			drake.on("drop", function(event){
				if ($('#initialColumn').children().length == 0){
					$('#done').removeClass('disabled')
				} else {
					$('#done').addClass('disabled')
				}
			});
			//binding for submit button/link
			$('#done').click(function() {	
				if(!$('#done').hasClass('disabled')){
					$('#hiddenResults').val(JSON.stringify(getResults()));
					$('#submitForm').click();
				}
			});
		}
		$('#hiddenGroups').remove();
		$('#hiddenCards').remove();
		$('#hiddenType').remove();
		$('#hiddenActive').remove();
	}
	function setUpDropZones(){
		for (var i = 0; i < zoneNum; i++) {
			$('#dropZoneParent').append('<div id="dropZone'+i+'"class="dropZone accepts-groups nested"></div>');
		}
	}
	//dropzones for groups need to be created before default groups
	setUpDropZones();
	loadDatafromDB();
});
