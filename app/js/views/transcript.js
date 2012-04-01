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
		
		
		initialize : function(params){
			_.bindAll(this, 'render', 'renderChildren', 'highlightStatements');			
			
			// alias
			this.statements = this.collection;
			// also, transcript is given reference to people collection from app
			this.people = params.people;
			
			this.people.on("change:is_focus", this._onPersonFocused, this);
		},
		
		render : function(){
			
			this.$el.html(this.template( ));	
			this.renderChildren();		
			
			this.statement_indiv_els = this.$(".statement");
			return this;
		},
		
		renderChildren : function(){
			// render statements
			var self = this;
			this.collection.each(function(_s){
				// leaving error here
				// to decide: create many statement views? or create simple dom elements?
				var sj = _.extend(_s.toJSON(), {pid:_s.pid, id:"stmt-"+_s.cid, cid:_s.cid});
				var shtml = self.template_statement(sj);
				self.$("#statements").append(shtml);
			});			
		},
		
		highlightStatements : function(){
			
		},
		
		_onPersonFocused : function(changed_person, change_bool){
			// pre: 	a person's is_focus attribute has changed
			// post: 	all statements with class "person.pid" have .highlight class toggled
			
			var self = this;
		//	var stmt = this.statements.filter(function(_s){_s.pid === changed_person.cid});
		
			console.log("coutn statements: " + this.statement_indiv_els.length)
		
			var stmts = this.statement_indiv_els.filter("." + changed_person.pid);
			stmts.toggleClass('highlight', change_bool);
			

		}
		
	});

	return TranscriptView;
});