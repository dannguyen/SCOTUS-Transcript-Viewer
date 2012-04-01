define([
  'jquery',
  'underscore', 
  'backbone',
  'models/person',
  'collections/focused',
   'views/person-infobox',
  'text!templates/t-people-panel.html'

	], function($,_,Backbone,
		PersonModel, FocusedCollection, PersonInfoboxView, 
		templatePeoplePanel
	){

	var PeoplePanelView = Backbone.View.extend({
		
		model_view : PersonInfoboxView,
		className : "panel",
		tagName : "div",
		template : _.template(templatePeoplePanel),
		
		
		
		events : {
			"click .apptk.next_focused_asset" : "_on_next_focused_asset",
			"click .apptk.prev_focused_asset" : "_on_prev_focused_asset",
			"click .apptk.show_all" : "_on_show_all" // could be done with meta-prog, TK,
		},
		
		initialize : function(){
			
			_.bindAll(this, 'render', '_focusOn', '_focusOff', '_gotoAsset', '_onInfoboxClick', 'subRender', '_setFocusedPerson', '_getFocusedPerson');
			
			this.mode = "list";
			this.focused_model = null;
			
			// alias
			this.people_collection = this.collection;
		},
		
		render : function(){
			
			var self = this;
			this.$el.html(this.template( ));
			this.$focus_subpanel = this.$('.focus-subpanel');

			// bind panel view events						
			this.collection.each(function(_m){
				var model_infobox_view = new self.model_view({ model:_m, id:"Infobox-" +_m.cid});				
				// bind events
				
				model_infobox_view.on(
					"infobox_click", 
					function(_model){self._onInfoboxClick(_model); 
				});
				
				self.$(".list").append( model_infobox_view.render().el );
			});
			
			this.subRender();
			
			return this;
		},
		
		subRender: function(){
			// handle the changing of panel controls
			// each infobox handles its own .focus change upon change:is_focus
			
			// pre: 	model's is_focus change is handled by _focusOn
			if(this.mode == "list"){
				this.people_collection.each(function(_vm){_vm.trigger("show");});	
				this.$('.apptk.show_all').fadeOut(200);		
				this.$focus_subpanel.hide();				

			}else if(this.mode == "focus"){				
				
				this.people_collection.filterUnfocused().each(function(_vm){ _vm.trigger("hide");});
				
				this.$('.apptk.show_all').slideDown(100); 
				this.$focus_subpanel.slideDown(100);
			}
			
		},
		
		
		
/*********
private
*********/		
	
	
		
		_focusOn : function(m){
			// pre: 	m is a model passed by _onInfoboxClick, which is triggered by
			// 			an person-infobox click event. No changes are made to the model
			// 			by person-infobox. It is up to people-panel to change focus
			
			// post: 	call to _setFocusedPerson sets model in collection `is_focus` to true
			this.mode = "focus";
			this._setFocusedPerson(m);
			this.subRender();
		},
		
		_focusOff : function(){ 
			this.mode = "list";
			this._setFocusedPerson(null);
			this.subRender();			
		},
		
		_getFocusedPerson : function(){  
			// superflous? TK
			// _focusOn is the main way that this.focused_model is set externally
			
			// pre: 	relies on this.focused_model is set and does not touch the collection
			// 			i.e. NOT `return this.people_collection.getFocused();` 
			if(this.focused_model){
				return this.focused_model;
			}else{ return null; } // should return false?
		},
		
		_getFocusedPersonStatements : function(){
			// wrapper function for getting a person's assets
			// may be deprecated later
			//
			// pre: 	this.focused_model is set
			// post: 	returns collection of this.focused_model statements
			var p = this._getFocusedPerson();
			if( !_.isNull(p)){
				// TK: person statements are models, whereas transcript uses DOM selectors
				// to be resolved TK
				return p.statements;
			}else{
				return null;
			}
		},

		_gotoAsset : function(dir, person){
			// pre: 	dir is either a direction(prev, next) or cid of an asset(a statement)
			//  		optionally: person contains a persont o filter collection by
			// post: 	triggers "moveTranscript" event which App.transcript listens to 
			
			this.trigger("moveTranscript", dir, person);
		},
		
		_setFocusedPerson : function(m){ 
			//	sets reference to this.focused_model and alters focus on collection
			//
			
			// pre: 		`m` contains a model in the panel collection to focus on
			//				OR, null is passed in, which removes focus from collection
			//				
			// post: 		collection focuses or loses focus of model, dependent on `m`
			// 				this.focused_model caches reference		 
			if(!_.isNull(m) && m.hasOwnProperty('cid')){ // better test? TK
				this.people_collection.setFocus( m );
				this.focused_model = m; 
			}else{ 		
				this.people_collection.removeFocus();		
				this.focused_model = null;
			}
			return this.focused_model;
		}, 
		
		
		
		_onInfoboxClick : function(m){
			this._focusOn(m);
		},
		
		_on_next_focused_asset : function(){
			this._gotoAsset("next", this._getFocusedPerson());
		},
		
		_on_prev_focused_asset : function(){
			this._gotoAsset("prev", this._getFocusedPerson());
		},
		_on_show_all : function(){
			this._focusOff();
		},

	
		
	});

	return PeoplePanelView;
});

