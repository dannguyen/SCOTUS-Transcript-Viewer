define([
  'jquery',
  'underscore', 
  'backbone',
  'collections/focused',


	], function($,_,Backbone,
		FocusedCollection){

	var TranscriptScrubberView = Backbone.View.extend({ 
		className : 'scrubber',
		
		tagName : 'div',
		events : {
			'click' : 'jumpToPosition' 
		},
		initialize : function(params){
			
			_.bindAll(this, 'updateTick', 'render');
			// this.collection is passed in from the transcript.controller's statements collection
			this.statements = this.collection;
			this.transcript_height = 0;
			this.controller = params.controller;
			
			var self = this;
			
			this.controller.on("windowScrolled", this.updateTick, this);
			this.controller.on("windowResized", this._refreshTranscriptHeight, this);
			
		},
		
		render : function(){
			// this.statements has been initialized
			this.$el.html("<div class=\"progress-pin\">x</div>");
			this.$pin = this.$(".progress-pin");
		//	this.transcript_height = $("#statements-viewer").height();
		
			this._refreshTranscriptHeight();
			console.log("Scrubber rendered with " + this.statements.length + " statements and a height of " + this.transcript_height );
			
			return this;
		},
		
		
		getScrollPosition : function(with_pct){
			
			var t =  parseFloat($(document).scrollTop()) / (this.transcript_height);
			return with_pct === true ? t * 100 + "%" : t;
		},
		
		jumpToPosition : function(e){
			var offs = e.pageX - e.target.offsetLeft;
			var ow = $(".container").width();
			console.log("Jumping to: " + offs + ", out of " + ow);
			console.log(offs / ow);

			// todo: fire jumpTo event, with decimal pct, to transcriptview
			// 	transcriptview needs to register listener
		},

		updateTick : function(e){
			var t = this.getScrollPosition(true);
			console.log(t);


			this.$pin.css({left:t});	
			console.log('update tick: ' + t + "   transcriptheight: " + this.transcript_height);
		},
		
		_refreshTranscriptHeight : function(){
			this.transcript_height = $("#statements-viewer").height();
		}
	
	
		
	});
	
	return TranscriptScrubberView;
});