$(document).ready(function() {

	var words = ['Accessible', 'Desirable', 'Gets in the way', 'Patronizing', 'Stressful', 'Appealing', 'Easy to use', 'Hard to use', 'Personal', 'Time-consuming', 'Attractive', 'Efficient', 'High quality', 'Predictable', 'Time-saving', 'Busy', 'Empowering', 'Inconsistent', 'Relevant', 'Too technical', 'Collaborative', 'Exciting', 'Intimidating', 'Reliable', 'Trustworthy', 'Complex', 'Familiar', 'Inviting', 'Rigid', 'Uncontrollable', 'Comprehensive', 'Fast', 'Motivating', 'Simplistic', 'Unconventional', 'Confusing', 'Flexible', 'Not valuable', 'Slow', 'Unpredictable', 'Connected', 'Fresh', 'Organized', 'Sophisticated', 'Usable', 'Consistent', 'Frustrating', 'Overbearing', 'Stimulating', 'Useful', 'Customizable', 'Fun', 'Overwhelming', 'Straight Forward', 'Valuable'];
	var wordSelectionLimit = 5;
	var onStageTwo = false;
	var selectedArr = [];
	var selectedNum = 0;
	$('#allCardsSelected').hide();

	function updateView(){
		if(selectedNum === wordSelectionLimit){
			$( "#cardArea li:not(.selected)").toggleClass('disabled');
			$('#textArea').html('All Done!');
			recordSelected();
		} else {
			$( "#cardArea li").removeClass('disabled');
			$('#textArea').html('Select your top 5 cards.');
		}
	}

	function recordSelected(){
		selectedArr = [];
		$( "#cardArea li.selected").each(function( index ) {
		  selectedArr.push($(this).text());
		});
		console.log(selectedArr);
	}

	function addWords(){
		for (var i = 0; i < words.length; i++) {
			var newWord = $("<li>"+words[i]+"</li>");
			$('#cardArea').append(newWord);
		}
	}
	addWords();

  	$("#cardArea li").click(function() {
		$(this).toggleClass("selected");
		selectedNum = $('#cardArea li.selected').length;
		if(onStageTwo){
			updateView();	
		} else {
			$('#textArea').html('Select at least 10 cards that represent your experience with the system. ('+selectedNum+' selected)');
			if(selectedNum > 9){$('#allCardsSelected').show();} 
			else {$('#allCardsSelected').hide();}
		}
	});

  	$("#allCardsSelected").click(function() {
		$( "#cardArea li:not(.selected)").each(function( index ) {
			$(this).remove();
		});
		$('#textArea').html('Select your top 5 cards.');
		$( "#cardArea li.selected").toggleClass('selected');
		onStageTwo = true;
		$(this).remove();
	});

	//-------------------------------------------------------------------
});

