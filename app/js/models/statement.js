define([
  'jquery',
  'underscore', 
  'backbone',
  ], function($, _, Backbone){
		
  	var StatementModel = Backbone.Model.extend({		
		defaults:{
			is_focus: false
		},

	    initialize : function(params){
			this.pid = this.get('pid');
			_.bindAll(this, 'wordCount');
		},
		
		wordCount : function(){
			// returns wordCount, which may be an attribute
			return parseInt(this.get('word_count'));
		}
  });

  return StatementModel;
});