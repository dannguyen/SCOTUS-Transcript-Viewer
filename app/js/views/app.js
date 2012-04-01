define([
  'order!jquery',
  'order!underscore', 
  'order!backbone',
 'order!js_other_plugins',
  'order!js_smooth_plugin',
	

  
  'models/person',
  'models/statement',

  'collections/focused',
  'views/people-panel',
  'views/transcript'

 // 'views/todos',
//  'text!templates/stats.html'
  ], 
 //function($, _, Backbone, Todos, TodoView, statsTemplate){
   function($, _, Backbone, js_other_plugins, js_smooth_plugin, 
			PersonModel, StatementModel, FocusedCollection, PeoplePanelView, TranscriptView
 	){
		
		
  		var AppView = Backbone.View.extend({

	    // Instead of generating a new element, bind to the existing skeleton of
	    // the App already present in the HTML.
	
	    el: $("#woz"),

	    events: {

	    },

	    initialize: function() {
		
		   //TKKTKTKT
		  this.mode = "transcript"
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
			var self = this;
			
			////////////////////////
			// for transcript viewer mode

			if(this.mode=='transcript'){
						
				//////////////////
				// people
				_.each(data.people, function(_p){
					var person = new PersonModel(_p);
					person.statements = new FocusedCollection({model:StatementModel});
					self.people.add(person);					
				});
				$("#init-message").html("Collections are loaded");				
			
				//////////////
				// statements
				
				_.each(data.argument.statements, function(_s){
					var p = self.people.find(function(_p){return _p.key_name === _s.person_key_name;})  // TK to be redone with diff data model
					
					// Caution: pid refers to person.cid; person.pid is an alias for cid
					var statement = new StatementModel(_.extend(_s, {pid:p.pid, person_name:p.key_name}));
					
					self.statements.add(statement);
					p.statements.add(statement);
				});
				
				
				//////////////////
				// people wrap up, ugly! TK
				this.people.each( function(_p){
					_p.setNestedAttributes();
				});
			
			}
			
		},
		
		_init_viewCreation : function(data){
			// should be specific to each mode !?
			var self = this;
			
			////////////////////////
			// for transcript viewer mode
			
			if(this.mode=='transcript'){
				this.mainview = new TranscriptView({
					collection: this.statements, id: "transcript", people:this.people});
				
				/// append panels
				this.panels.people = new PeoplePanelView({
					collection:this.people, id : "people-panel"});
			
				// wire panel and mainviewer			
				this.panels.people.on("moveTranscript", self.mainview.moveTranscript, self.mainview);
			
			}
			
			//render main screen
			this.mainscreen_el.append(this.mainview.render().el);
					
			// render panels
			_.each(this.panels, function(_panel){  
				self.panels_el.append(_panel.render().el);
			});
			
		}
		
		
		
		
  });
  return AppView;
});