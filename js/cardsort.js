var cs = {};
cs.groupNum = 0;
cs.zoneNum = 5;
var drake = null;

function updateGroupArray(){
	cs.groups = [];
	$('.group').each(function(index) {
		var title = $(this).children('.title')
		cs.groups.push(title.text());
	});
}

function initDrake() {
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
	return drake;

}

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
	updateGroupArray();
}

function createGroup(groupname, focus_on_creation = false){
	cs.groupNum+=1;
	var group = $("<div class='group'></div>");
	var groupTitle = $("<div class='title' contenteditable='false'>"+groupname+"</div>");
	var closeIcon = $("<i class='fa fa-times closeicon' aria-hidden='true'></i>");
	var nestedArea = $("<div class='droparea nested accepts-items'></div>");
	var grabIcon = $("<div class='iconContainer'><i class='fa fa-ellipsis-h grabicon' aria-hidden='true'></i></div>");
	
	groupTitle.blur(function(event){
		//helper function for blur event
		var title = event.target;
		var newName = $(title).text().trim().replace(/[^\w\s]/gi, '');
		if (cs.lastChanged != newName){
			if (newName == ''){
				$(title).html('Default Group');
			} else {
				if (!groupNameExists(newName)){
					$(title).html(newName);
				} else {
					alert('Group name already exists.');
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

function setup(input_studyType,input_status,input_responseID,input_cards,input_groups){
	drake = initDrake();
	cs.studyType = input_studyType;
	cs.status = input_status;
	cs.responseID = input_responseID;

	if(cs.studyType == 'closed'){
		var groups = input_groups.split(";").map(function(item) {
		  return item.trim();
		});
		for (var i = 0; i < groups.length; i++) {
			if (groups[i] != ''){
				createGroup(groups[i]);	
			}
		}
	}

	var cards = input_cards.split(";").map(function(item) {
		  return item.trim();
	});
	for (var i = 0; i < cards.length; i++) {
		if (cards[i] != ''){
			createCard(cards[i]);
		}
	}

	// override submit button action, write results to field and then submit
	$('#done').click(function(){
	  $('#hiddenResults').val(JSON.stringify(getResults()));
	  $('#resultsForm').submit();
  	});

	//dragula event to check for empty intial list on 'drop' actions
	drake.on("drop", function(event){
		if (($('#initialColumn').children().length == 1)){
			$('#done').show();
		} else {
			$('#done').hide();

		}
	});
	$('#newGroupButton').click(function() {
		var box = bootbox.dialog({
			message: "<label for='groupname'>Enter the name of the group:</label><br><br>\
		    <input id='groupname' name='groupname'  class='form-control' type='text' />\
		    <br/>\
		    <span id='noblankname' class='text-danger d-none'>Group name cannot be blank</span>\
		    <span id='groupalreadyexisits' class='text-danger d-none'>Group already exists</span>\
		    <script>document.getElementById('groupname').focus()</script>",
			closeButton: false,
			buttons: {
				confirm: {
					label: 'OK',
					className: 'btn-success pull-right',
					callback: function() {
						updateGroupArray();
						var groupname = $('#groupname').val();
						if(groupname == ""){
							console.log("Group name is blank.")
							$('#noblankname').removeClass("d-none")
							return false;
						} else if (groupNameExists(groupname)) {
							$('#groupalreadyexisits').removeClass("d-none")
							return false;
						} else {
							createGroup(groupname, true);
							return true;
						}
					}
				},
				cancel: {
					label: 'Cancel',
					className: 'btn-link',
					callback: function() {
						return;
					}
				}
			}
		});
		box.on('shown.bs.modal',function(){
		  $("#groupname").focus();
		});
	});

	$('#done').hide();
}

