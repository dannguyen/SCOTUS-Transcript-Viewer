define([
  'order!jquery',
  'order!underscore', 
  'order!backbone',
  'order!controllers/controller',
  'routers/main_router'

  ], 
	function($, _, Backbone, MyControllers, MainRouter		
 	){
		
		
  		var AppView = Backbone.View.extend({

	    // Instead of generating a new element, bind to the existing skeleton of
	    // the App already present in the HTML.
	
	    el: $("#woz"),

	    events: {

	    },

	    initialize: function() {
		  var self = this;
		
		  // standard elements
		  this.mainscreen_el = this.$("#mainscreen");
		  this.panels_el = this.$('#panels');
	      _.bindAll(this, 'render', 'renderPanel', 'renderMainscreen' );
		  $("#init-message").html("App is initialized");
		
		
		  this.render();
		
		  //some kind of routing action
		
		
		//  this.router = new MainRouter();
	   	 // Backbone.history.start();
	    
	/* stub code */
		  this.controller_name = 'transcript';
		  this.controller = new MyControllers[this.controller_name]({app:self});	
	  	  this.controller.execute();
		
	    },
	

	    render: function() {
     		return this;
	    },

		renderMainscreen : function(mv, callback){
			this.mainscreen_el.append(mv.render().el);
			
			if(typeof callback === "function"){
				callback.call();
			}
			
			return mv;
		},
		
		renderPanel : function(panel){
			this.panels_el.append(panel.render().el);
			return panel;
		}

		/// PRIVATE THINGS THAT WILL TK
		
		// 
		
  });
  return AppView;
});