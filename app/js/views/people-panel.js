define([
  'jquery',
  'underscore', 
  'backbone',
  'models/person',
  'collections/people',
   'views/person-infobox'
	], function($,_,Backbone,
		PersonModel, PeopleCollection, PersonInfoboxView
	){

	var PeoplePanelView = Backbone.View.extend({
		
		model_view : PersonInfoboxView,
		className : "panel",
		tagName : "div",
		mode : "list",
		
		initialize : function(){
			
			_.bindAll(this, 'render', '_buildFocusBox', '_createFocusBox', '_focusOn', '_onInfoboxClick');
			
		},
		
		render : function(){

			var self = this;
			this.collection.each(function(_m){
				var member_infobox_view = new self.model_view({ model:_m, id:"Infobox-" +_m.cid});				
				// bind events
				member_infobox_view.on("on_click", function(_model){self._onInfoboxClick(_model); });
				self.$el.append( member_infobox_view.render().el );
			});
			
			return this;
		},
		
		
		_buildFocusBox : function(m){
		//	return new PersonFocusBoxView({model:m});
		},
		
		_createFocusBox : function(m){
			if(!_.isUndefined(this.focus_box)){
				this.focus_box.remove();
				this.focus_box = undefined;
			}
			this.focus_box = this._buildFocusBox(m); 

		},
		
		_focusOn : function(m){
			this.collection.focusOn(m);
		},
		
		_onInfoboxClick : function(m){
			console.log('_onInfoboxClick');
			this._focusOn(m);
		}

	
		
	});

	return PeoplePanelView;
});

