define([
  'jquery',
  'underscore', 
  'backbone',

  'models/person',
  'models/statement',

  'collections/focused',
  'views/people-panel',
  'views/transcript'

 // 'views/todos',
//  'text!templates/stats.html'
  ], 
 //function($, _, Backbone, Todos, TodoView, statsTemplate){
   function($, _, Backbone, 
			PersonModel, StatementModel, FocusedCollection, PeoplePanelView, TranscriptView
 	){
		
		
  		var AppView = Backbone.View.extend({

	    // Instead of generating a new element, bind to the existing skeleton of
	    // the App already present in the HTML.
	
	    el: $("#woz"),

	    events: {

	    },

	    initialize: function() {
		  // member collections
		  this.people = new FocusedCollection();
		  this.statements = new FocusedCollection();
		  // panels
		  this.panels = {};
		
		  // standard elements
		  this.mainscreen_el = this.$("#mainscreen");
		  this.panels_el = this.$('#panels');


		  ///////
	      _.bindAll(this, 'render',
			'_init_collectionInitialization', '_init_dataInitialization', '_init_viewCreation'
		  );
		 
		
		  $("#init-message").html("App is initialized");
		
		  this.render();
		
			
		  // this occurs as default viewer, TK needs to change
		  this._init_dataInitialization();
		
		
	    },

	    render: function() {
     		return this;
	    },


		/// PRIVATE THINGS THAT WILL TK
		
		// 
		
	
		
		// initialization spaghetti
		_init_dataInitialization : function(){
		//TK
			var self = this;
			var __datafile_name = "datafiling-temp.json";
			console.log(__datafile_name);
			$.getJSON(__datafile_name, function(data){
				
				$("#init-message").html("Data is loaded");				
				self._init_collectionInitialization(data);
				self._init_viewCreation();
			});			
			console.log("getJson called")
		},
		
		_init_collectionInitialization : function(data){
			// initializes collection AND views
			// TK
			var self = this;
			
			// people
			_.each(data.people, function(_p){
				var person = new PersonModel(_p);
				self.people.add(person);					
			});
			$("#init-message").html("Collections are loaded");				
			
			
			// statements
			_.each(data.argument.statements, function(_s){
				var statement = new StatementModel(_s);
				self.statements.add(statement)
				
			});
			
		},
		
		_init_viewCreation : function(data){
			// should be specific to each mode !?
			var self = this;
			
			////////////////////////
			// for transcript viewer mode
			
			this.mainview = new TranscriptView({collection: this.statements, id: "transcript"});
			
			this.mainscreen_el.append(this.mainview.render().el)
		
			
			/// append panels
			this.panels.people = new PeoplePanelView({collection:this.people, id : "people-panel"});
			// render panels
			_.each(this.panels, function(_panel){  
				self.panels_el.append(_panel.render().el);
				_panel.on("moveTranscript", self._moveTranscript, self);
			});
		},
		
		_moveTranscript : function(dir, modil){
		
			if(dir == "next"){
				console.log("_moveTranscript forward");
			}else if(dir == "prev"){
				console.log("_moveTranscript backwards");
			}else{
				console.log("_moveTranscript to cid:  " + dir);
			}
			
			if(!_.isUndefined(modil)){
				console.log("  _moveTranscript filter by parent model.cid: " + modil.cid);
				
			}
			
		},
		
		
		
		
  });
  return AppView;
});