define([
  'jquery',
  'underscore', 
  'backbone',
  'text!templates/t-person-infobox.html'
  ], function($, _, Backbone, templatePersonInfobox){
		
  	var PersonInfoboxView = Backbone.View.extend({
		className: "infobox",
	    tagName: "li",
		template: _.template(templatePersonInfobox), 

	    events: {
			"click" : function(){ this.trigger('infobox_click', this.model);}
	    },

	    initialize: function() {
			var self = this;
	      _.bindAll(this, 'render', '_hide', '_show');
		  this.model.on("change:is_focus", function(e, is_f){ self.$el.toggleClass("is_focus", is_f); });
		
		  this.model.on("hide", this._hide);
		  this.model.on("show", this._show);
		
	    },
	

	    render: function() {
			this.$el.html(this.template( this.model.toJSON() ));
     		return this;
	    },
	
		

		_hide: function(){
			this.$el.hide(200);
		},
		
		_show: function(){
			this.$el.show(200);
		},



  });
  return PersonInfoboxView;
});