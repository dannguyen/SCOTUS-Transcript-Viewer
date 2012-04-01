define([
  'jquery',
  'underscore', 
  'backbone',
  ], function($, _, Backbone){
		
  	var ArgumentModel = Backbone.Model.extend({		
		defaults:{
			is_focus: false
		},

	    initialize : function(params){
			// will have people_collection, statement_collection, section_collection
		}
  });

  return ArgumentModel;
});