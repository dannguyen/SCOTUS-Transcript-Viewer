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
   function($, _, Backbone, js_other_plugins, js_smooth_plugin, 
			PersonModel, StatementModel, FocusedCollection, PeoplePanelView, TranscriptView
 	){
		
		// should not be a view, but TK
  		var TranscriptController = Backbone.View.extend({ 
	
			initialize: function(params){
				this.app = params.app;
				this.panels = {};			  
				console.log("Hello I am transcript Controller");				

			},
			
			execute : function(){
				console.log("TranscriptController: execute!");
				this._init_dataInitialization();
			},
		
	
			// initialization spaghetti
			_init_dataInitialization : function(){
				var self = this;
				var __datafile_name = "datafiling-temp.json";
				console.log(__datafile_name);

				$.getJSON(__datafile_name, function(data){
					$("#init-message").html("Data is loaded");				
					self._init_collectionInitialization(data);
					self._init_viewCreation();
					self._init_wireViews();
				});			


			},

			_init_collectionInitialization : function(data){
				// initializes collection AND views
				var self = this;

				////////////////////////
				// for transcript viewer mode
			  	this.people = new FocusedCollection();
			  	this.statements = new FocusedCollection();


				//////////////////
				// people
				_.each(data.people, function(_p){
					var person = new PersonModel(_p);
					person.statements = new FocusedCollection({model:StatementModel});
					self.people.add(person);					
				});

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


			},

			_init_wireViews : function(){
				// wire panel and mainscreen together			
				var self = this;
				this.panels.people.on("moveTranscript", self.mainscreen.moveTranscript, self.mainscreen);
				
			},
			
			_init_viewCreation : function(data){
				var self = this;

				
				//render main screen
				this.mainscreen = new TranscriptView({
					collection: this.statements, id: "transcript", people:this.people});
				
				this.app.renderMainscreen(this.mainscreen);


					
				/// append panels
//				this.panels.case = new ArgumentPanelView({
///					model: this.argument });
				this.panels.people = new PeoplePanelView({ collection:this.people, id : "people-panel"});
			
			
				// render panels
				_.each(this.panels, function(_panel){  
					self.app.renderPanel(_panel);
				});
			} // end of view Creation


		});
		
		return TranscriptController;
	}
);
