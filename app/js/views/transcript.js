define([
  'jquery',
  'underscore', 
  'backbone',
  'models/statement',
  'collections/focused',
  'text!templates/t-transcript.html',
  'text!templates/t-transcript-statement.html'


	], function($,_,Backbone,
		StatementModel, FocusedCollection, templateTranscript, templateTranscriptStatement){

	var TranscriptView = Backbone.View.extend({
		template : _.template(templateTranscript),
		template_statement : _.template(templateTranscriptStatement),
		
		
		initialize : function(){
			_.bindAll(this, 'render', 'renderChildren');			
			
			// alias
			this.statements = this.collection;
		},
		
		render : function(){
			
			this.$el.html(this.template( ));	
			this.renderChildren();		
			return this;
		},
		
		renderChildren : function(){
			// render statements
			var self = this;
			this.collection.each(function(_s){
				// leaving error here
				// to decide: create many statement views? or create simple dom elements?
				var sj = _.extend(_s.toJSON(), {pid:_s., id:});
				var shtml = self.template_statement(sj);
				self.$("#statements").append(shtml);
			});			
		}
		
	});

	return TranscriptView;
});