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
			
			//////////////////
			// people
			_.each(data.people, function(_p){
				var person = new PersonModel(_p);
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
				
			});
			
		},
		
		_init_viewCreation : function(data){
			// should be specific to each mode !?
			var self = this;
			
			////////////////////////
			// for transcript viewer mode
			
			this.mainview = new TranscriptView({collection: this.statements, id: "transcript", people:this.people});
			
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
			var self = this;
			
			
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
			var filter_classid = ".statement" + (!_.isUndefined(modil) ? '.' + modil.cid : '');

			
			/// TK XK
			// tk spaghetti
			// ## alias for $.statement_indiv_els

			// find statement closest to what's in viewport
			var t_scrolltop = $(window).scrollTop();
			console.log("Scrolltop pos of transcript: " + t_scrolltop);
			
			var c_el = $("#transcript .statement").closestToTop(t_scrolltop);
			console.log("current element is : " + c_el.attr('id'));
			
			console.log("looking for filter_classid: " + filter_classid );
			var starget = c_el.nextAll(filter_classid).not('#'+c_el.attr('id')).first();
			
			console.log("found target: " + starget.attr('id'));	
			console.log(starget.text());
			
			$.smoothScroll({
		    	scrollTarget: starget
		  	});
			
			
		},
		
		
		
		
  });
  return AppView;
});