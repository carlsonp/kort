$(document).ready(function() {
	var c = {
		words: ['Accessible', 'Desirable', 'Gets in the way', 'Patronizing', 'Stressful', 'Appealing', 'Easy to use', 'Hard to use', 'Personal', 'Time-consuming', 'Attractive', 'Efficient', 'High quality', 'Predictable', 'Time-saving', 'Busy', 'Empowering', 'Inconsistent', 'Relevant', 'Too technical', 'Collaborative', 'Exciting', 'Intimidating', 'Reliable', 'Trustworthy', 'Complex', 'Familiar', 'Inviting', 'Rigid', 'Uncontrollable', 'Comprehensive', 'Fast', 'Motivating', 'Simplistic', 'Unconventional', 'Confusing', 'Flexible', 'Not valuable', 'Slow', 'Unpredictable', 'Connected', 'Fresh', 'Organized', 'Sophisticated', 'Usable', 'Consistent', 'Frustrating', 'Overbearing', 'Stimulating', 'Useful', 'Customizable', 'Fun', 'Overwhelming', 'Straight Forward', 'Valuable'],
		wordSelectionLimit: 5,
		onStageTwo: false,
		selectedArr: [],
		selectedNum: 0,
		init: function(){
			$('#next').hide();
			this.addWords();
			this.bindNextButton();
			this.bindCardClick();
		},
		addWords: function(){
			for (var i = 0; i < this.words.length; i++) {
				$('#cardArea').append("<li>"+this.words[i]+"</li>");
			}
		},
		bindNextButton: function(){
		  	$("#next").click(function() {
				$( "#cardArea li:not(.selected)").each(function( index ) {
					$(this).remove();
				});
				$("#cardArea li.selected").toggleClass('selected');
				c.onStageTwo = true;
				c.updateView();
				$(this).remove();
			});
		},
		bindCardClick: function(){
	  		$("#cardArea li").click(function() {
				$(this).toggleClass("selected");
				c.updateView();
			});
		},
		updateView: function(){
			this.selectedNum = $('#cardArea li.selected').length;
			if(this.onStageTwo){
				if(this.selectedNum === this.wordSelectionLimit){
					$( "#cardArea li:not(.selected)").toggleClass('disabled');
					$('#textArea').html('All Done!');
					printSelectedToConsole();
				} else {
					$( "#cardArea li").removeClass('disabled');
					$('#textArea').html('Select your top 5 cards.');
				}
			} else {
				$('#textArea').html('Select at least 10 cards that represent your experience with the system. ('+this.selectedNum+' selected)');
				if(this.selectedNum > 9){$('#next').show();} 
				else {$('#next').hide();}
			}
		}
	}
	c.init();
});

