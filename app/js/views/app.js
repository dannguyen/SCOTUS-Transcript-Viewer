define([
  'order!jquery',
  'order!underscore', 
  'order!backbone',
  'order!controllers/controller'
/*
 'order!js_other_plugins',
  'order!js_smooth_plugin',
  'models/person',
  'models/statement',
  'collections/focused',
  'views/people-panel',
  'views/transcript'
*/

 // 'views/todos',
//  'text!templates/stats.html'
  ], 
 //function($, _, Backbone, Todos, TodoView, statsTemplate){
  // function($, _, Backbone, js_other_plugins, js_smooth_plugin, 
//			PersonModel, StatementModel, FocusedCollection, PeoplePanelView, TranscriptView
	function($, _, Backbone, MyControllers		
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
		  this.mode = "Transcript"
		  this.controller = new MyControllers[this.mode]({app:self});	
		  this.controller.execute();
		
	    },

	    render: function() {
     		return this;
	    },

		renderMainscreen : function(mv){
			this.mainscreen_el.append(mv.render().el);
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