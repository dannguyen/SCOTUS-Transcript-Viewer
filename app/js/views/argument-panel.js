define([
  'jquery',
  'underscore', 
  'backbone',
  'models/argument',
  'collections/focused',
  'text!templates/t-argument-panel.html'


	], function($,_,Backbone,
		ArgumentModel, FocusedCollection, templateArgumentPanel
	){

	var ArgumentPanelView = Backbone.View.extend({
		
		className : "panel",
		tagName : "div",
		template : _.template(templateArgumentPanel),
		events : {
		
		},
		
		initialize : function(){
			_.bindAll(this, 'render', 'subRender');// '_focusOn', '_focusOff', '_gotoAsset', '_onInfoboxClick', 'subRender', '_setFocusedPerson', '_getFocusedPerson');
			
			this.mode = "list";
			this.focused_model = null;
			this.argument = this.model;
			
			// alias
		},
		
		render : function(){
			var self = this;
			this.$el.html(this.template(this.argument.toJSON() ));
			this.$focus_subpanel = this.$('.focus-subpanel');
			
			this.subRender();
			
			return this;
		},
		
		
		subRender: function(){
			// handle the changing of panel controls
			// each infobox handles its own .focus change upon change:is_focus
			
			// pre: 	model's is_focus change is handled by _focusOn
			if(this.mode == "list"){
				

			}else if(this.mode == "focus"){				
				
			
			}
			
		},
		
		
		
/*********
private
*********/		
	
	
		
		_focusOn : function(m){
			this.mode = "focus";
	
		},
		
		_focusOff : function(){ 
			this.mode = "list";
		}
		
	
	
		
	});

	return ArgumentPanelView;
});

