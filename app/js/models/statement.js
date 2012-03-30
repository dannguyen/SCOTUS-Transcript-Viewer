define([
  'jquery',
  'underscore', 
  'backbone',
  ], function($, _, Backbone){
		
  	var StatementModel = Backbone.Model.extend({		
		defaults:{
			is_focus: false
		},

	    initialize : function(){
//			_.bindAll(this);
		}
  });

  return StatementModel;
});