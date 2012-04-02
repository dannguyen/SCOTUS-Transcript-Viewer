define([
  'jquery',
  'underscore', 
  'backbone',
	], function(){

	var MainRouter = Backbone.Router.extend({
		
		routes: {
	        "/:controller_name": "followRoute" // matches http://example.com/#anything-here
	    },
	
		followRoute : function(controller_name){
			
		}
		
	});

	return MainRouter;
});