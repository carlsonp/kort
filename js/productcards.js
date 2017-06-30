$(document).ready(function() {
	var c = {
		secondSelectionLimit: 5,
		firstSelectionLimit: 10,
		onStageTwo: false,
		selectedNum: 0,
		init: function(){
			$('#next').hide();
			this.loadDatafromDB();
			this.addWords();
			this.bindNextButton();
			this.bindCardClick();
			this.bindSendResults();
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
		bindSendResults: function(){
	  		$("#done").click(function() {
	  			var words = []
	  			$('#cardArea li.selected').each(function(idx,word){
	  				words.push($(word).text());
	  			});
	  			words.push(Date());
	  			$('#hiddenResults').val(JSON.stringify(words));
				$('#submitForm').click();
			});
		},
		updateView: function(){
			this.selectedNum = $('#cardArea li.selected').length;
			if(this.onStageTwo){
				if(this.selectedNum === this.secondSelectionLimit){
					$( "#cardArea li:not(.selected)").toggleClass('disabled');
					$('#doneParent').show();
				} else {
					$( "#cardArea li").removeClass('disabled');
					$('#textArea').html('Select your top 5 cards.');
				}
			} else {
				$('#textArea').html('Select at least 10 cards that represent your experience with the system. ('+this.selectedNum+' selected)');
				if(this.selectedNum >= this.firstSelectionLimit){
					$('#next').show();
				} else {
					$('#next').hide();
				}
			}
		},
		loadDatafromDB: function(){
			this.words = $('#hiddenWords').val().split(";").map(function(item) {
				  return item.trim();
			}).filter(function(n){ return n != ''});
			$('#hiddenWords').remove();
		}
	}
	c.init();
});

