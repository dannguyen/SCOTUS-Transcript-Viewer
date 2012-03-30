define([
  'jquery',
  'underscore', 
  'backbone',
  'models/person',
  'collections/people',
   'views/person-infobox',
  'text!templates/t-people-panel.html',
  'text!templates/t-people-panel-focusbox.html'

	], function($,_,Backbone,
		PersonModel, PeopleCollection, PersonInfoboxView, 
		templatePeoplePanel, templatePeoplePanelFocusbox
	){

	var PeoplePanelView = Backbone.View.extend({
		
		model_view : PersonInfoboxView,
		className : "panel",
		tagName : "div",
		mode : "list",
		template : _.template(templatePeoplePanel),
		template_focus: _.template(templatePeoplePanelFocusbox),
		
		
		
		events : {
			"click .apptk.next_asset" : "_on_next_asset",
			"click .apptk.prev_asset" : "_on_prev_asset",
			"click .apptk.show_all" : "_on_show_all" // could be done with meta-prog, TK			
		},
		
		initialize : function(){
			
			_.bindAll(this, 'render', '_focusOn', '_focusOff', '_onInfoboxClick');
			
		},
		
		render : function(){

			var self = this;
			this.$el.html(this.template( ));
			
			this.$focus_box = this.$('.focusbox');
			
			// bind panel view events
						
			this.collection.each(function(_m){
				var member_infobox_view = new self.model_view({ model:_m, id:"Infobox-" +_m.cid});				
				// bind events
				member_infobox_view.on("infobox_click", 
					function(_model){self._onInfoboxClick(_model); 
				});
				
				self.$(".list").append( member_infobox_view.render().el );
			});
			
			return this;
		},
		
		renderFocusbox : function(){
			var self = this;
			if (f = this._getFocused()){
				this.$('.focusin').empty().html( self.template_focus( f.toJSON()) );
			}
			
		},
		
/*********
private
*********/		
	
		_getFocused : function(){ return this.collection.getFocused(); },
		
		_focusOn : function(m){
			this.$('.apptk.show_all').slideDown(100); //TK spaghetti
			this.collection.focusOn(m);
			this.collection.filterUnfocused().each(function(_vm){ _vm.trigger("hide");});
			
			this.renderFocusbox();
			this.$focus_box.slideDown(100);
		},
		
		_focusOff : function(){
			this.$('.apptk.show_all').slideUp(100);
			this.collection.focusOff();
			this.collection.each(function(_vm){_vm.trigger("show");});			
			this.$focus_box.slideUp(100);
		},
		
		_onInfoboxClick : function(m){
			this._focusOn(m);
		},
		
		_on_next_asset : function(){
			console.log("next asset");
		},
		
		_on_prev_asset : function(){
			
		},
		_on_show_all : function(){
			this._focusOff();
		},

	
		
	});

	return PeoplePanelView;
});

