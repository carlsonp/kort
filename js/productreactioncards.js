$(document).ready(function() {
	var pc = {
		secondSelectionLimit: 5,
		firstSelectionLimit: 10,
		onStageTwo: false,
		selectedNum: 0,
	}

	function shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;
	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;
	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }
	  return array;
	}

	function loadDatafromDB(){
		pc.words = $('#hiddenWords').val().split(";").map(function(item) {
			  return item.trim();
		}).filter(function(n) { return n != ''});

		if ($('#hiddenRandomize').val() == "on") {
			pc.words = shuffle(pc.words)
		}
		
		for (var i = 0; i < pc.words.length; i++) {
			$('#cardArea').append("<li>"+pc.words[i]+"</li>");
		}

		$("#done").click(function() {
			if ($("#cardArea li.selected").length >= pc.secondSelectionLimit) {
				pc.results = [];
				$('#cardArea li.selected').each(function(idx,word){
					pc.results.push($(word).text());
				});
				$('#hiddenResults').val(JSON.stringify(pc.results));
				$('#submitForm').click();
			}
		});	

		$('#hiddenWords').remove();
		$('#hiddenStatus').remove();
		$('#hiddenRandomize').remove();
	}

	function enableButton(buttonID){
		$(buttonID).removeClass('disabled');
		$(buttonID).addClass('btn-amber');
	}

	function disableButton(buttonID){
		$(buttonID).addClass('disabled');
		$(buttonID).removeClass('btn-amber');
	}

	function setInstructions(str){
		$('#textArea').html(str);
	}

	function updateView(){
		pc.selectedNum = $('#cardArea li.selected').length;
		if (pc.onStageTwo) {
			if(pc.selectedNum == pc.secondSelectionLimit){
				$( "#cardArea li:not(.selected)").toggleClass('disabled');
				enableButton('#done');
			} else {
				$( "#cardArea li").removeClass('disabled');
				setInstructions('Select your top 5 cards.');
				disableButton('#done');
			}
		} else {
			setInstructions('Select at least 10 cards that represent your experience with the system. ('+pc.selectedNum+' selected)');
			if(pc.selectedNum >= pc.firstSelectionLimit){
				enableButton('#nextBtn');
			} else {
				disableButton('#nextBtn');
			}
		}
	}
	
	$("#nextBtn").click(function() {
  		if ($("#cardArea li.selected").length >= pc.firstSelectionLimit) {
				$( "#cardArea li:not(.selected)").each(function(index) {
				$(this).remove();
			});
			$("#cardArea li.selected").toggleClass('selected');
			pc.onStageTwo = true;
			updateView();
			$('#done').show();
			$(this).remove();
  		}		
	});

	function init(){
		disableButton('#nextBtn');
		disableButton('#done');
		$('#done').hide();
		loadDatafromDB();
	}	
	init()

	$("#cardArea li").click(function() {
		$(this).toggleClass("selected");
		updateView();
	});
});

