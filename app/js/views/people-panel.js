define([
  'jquery',
  'underscore', 
  'backbone',
  'models/person',
  'collections/focused',
   'views/person-infobox',
  'text!templates/t-people-panel.html',
  'text!templates/t-people-panel-focusbox.html'

	], function($,_,Backbone,
		PersonModel, FocusedCollection, PersonInfoboxView, 
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
			"click .apptk.next_focused_asset" : "_on_next_focused_asset",
			"click .apptk.prev_focused_asset" : "_on_prev_focused_asset",
			"click .apptk.show_all" : "_on_show_all" // could be done with meta-prog, TK			
		},
		
		initialize : function(){
			
			_.bindAll(this, 'render', '_focusOn', '_focusOff', '_gotoAsset', '_onInfoboxClick');
			
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
	
	
		
		_focusOn : function(m){
			this.$('.apptk.show_all').slideDown(100); //TK spaghetti
			this.collection.focusOn(m);
			this.collection.filterUnfocused().each(function(_vm){ _vm.trigger("hide");});
			
			this.renderFocusbox();
			this.$focus_box.slideDown(100);
		},
		
		_focusOff : function(){ //TK not dry
			this.$('.apptk.show_all').slideUp(100);
			this.collection.focusOff();
			this.collection.each(function(_vm){_vm.trigger("show");});			
			this.$focus_box.slideUp(100);
		},
		
		_getFocused : function(){ return this.collection.getFocused(); },

		_gotoAsset : function(dir, m){
			// pre: dir is either a direction(prev, next) or cid of an asset(a statement)
			// post: triggers "moveTranscript" event which is read by App, which then
			// 		applies it to the TranscriptView
			
			this.trigger("moveTranscript", dir, m);
		},
		
		_onInfoboxClick : function(m){
			this._focusOn(m);
		},
		
		_on_next_focused_asset : function(){
			this._gotoAsset("next", this._getFocused());
		},
		
		_on_prev_focused_asset : function(){
			this._gotoAsset("prev", this._getFocused());
		},
		_on_show_all : function(){
			this._focusOff();
		},

	
		
	});

	return PeoplePanelView;
});

