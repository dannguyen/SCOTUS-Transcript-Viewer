define([
  'jquery',
  'underscore', 
  'backbone',
  ], function($, _, Backbone){
		
  	var PersonModel = Backbone.Model.extend({
		
		defaults:{
			is_focus: false,
			statement_count : 0
		},

	    initialize : function(){
			_.bindAll(this, 'setNestedAttributes');
			this.key_name = this.get('key_name');
			this.pid = this.cid;	// naming consistency
			this.is_justice = this.get('category') == 'SCOTUS';			
			
		
			// this.statements set by app
		},
		
		setNestedAttributes : function(){
			var self = this;
			this.set({
				'statement_count' : self.statements.length,
			});
			
			console.log(self.get('statement_count'))
			
		}
		
  });



  return PersonModel;
});