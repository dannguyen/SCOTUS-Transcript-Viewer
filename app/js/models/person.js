define([
  'jquery',
  'underscore', 
  'backbone',
  ], function($, _, Backbone){
		
  	var PersonModel = Backbone.Model.extend({
		
		defaults:{
			is_focus: false,
			statement_count : 0,
			word_count : 0,
			is_attributes_calculated: false,
		},

	    initialize : function(){
			_.bindAll(this, 'setNestedAttributes', 'isCalculated', '_calcWordCount');
			this.key_name = this.get('key_name');
			this.pid = this.cid;	// naming consistency
			this.is_justice = this.get('category') == 'SCOTUS';			
			
			
			
			// this.statements set by app
		},
		
		isCalculated : function(){
			// TK: why is this needed?
			// return true if setNestedAttributes has been run, which sets is_attributes_calculated
			return this.get('is_attributes_calculated');
		},
		
		setNestedAttributes : function(){
			// post: 	sets is_attributes_calculated to true
			
			var self = this;
			this.set({
				'statement_count' : self.statements.length,
				'word_count' : self._calcWordCount()
			});			
			
			this.set({'is_attributes_calculated' : true});
			
		},
						
		
		
		_calcWordCount : function(){
			// pre: 	this.statements set by app
			// TK
			// post: 
			//				returns sum of words in statements.
			return  this.statements.reduce(function(memo, _x){ return memo + _x.wordCount(); } , 0);	

		},
		
  });



  return PersonModel;
});