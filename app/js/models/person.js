define([
  'jquery',
  'underscore', 
  'backbone',
  ], function($, _, Backbone){
		
  	var PersonModel = Backbone.Model.extend({
		
		defaults:{
			is_focus: false
		},

	    initialize : function(){
//			_.bindAll(this);
			this.is_justice = this.get('category') == 'SCOTUS';			
		}
		

		
  });



  return PersonModel;
});