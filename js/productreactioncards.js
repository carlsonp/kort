$(document).ready(function() {
	pc = {
		secondSelectionLimit: 5,
		firstSelectionLimit: 10,
		onStageTwo: false,
		selectedNum: 0,
	}
	function loadDatafromDB(){
		pc.words = $('#hiddenWords').val().split(";").map(function(item) {
			  return item.trim();
		}).filter(function(n) {
			return n != ''
		});

		pc.responseID = $('#resid').val();
		
		for (var i = 0; i < pc.words.length; i++) {
			$('#cardArea').append("<li>"+pc.words[i]+"</li>");
		}

		if($('#hiddenStatus').val() == 'open'){
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
		}
		$('#hiddenWords').remove();
		$('#hiddenStatus').remove();
	}
	function enableButton(buttonID){
		$(buttonID).removeClass('btn-default')
		$(buttonID).removeClass('disabled')
		$(buttonID).addClass('btn-primary');
	}

	function disableButton(buttonID){
		$(buttonID).removeClass('btn-primary')
		$(buttonID).addClass('disabled','btn-default');
	}

	function setInstructions(str){
		$('#textArea').html(str);
	}

	function updateView(){
		pc.selectedNum = $('#cardArea li.selected').length;
		if (pc.onStageTwo) {
			if(pc.selectedNum == pc.secondSelectionLimit && pc.responseID != 'preview'){
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

