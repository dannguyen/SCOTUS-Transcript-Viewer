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
			"click" : function(){ this.trigger('on_click', this.model);}
	    },

	    initialize: function() {
			var self = this;
	      _.bindAll(this, 'render');
		  this.model.on("change:is_focus", function(e, is_f){ self.$el.toggleClass("is_focus", is_f); });
	    },

	    render: function() {
			this.$el.html(this.template( this.model.toJSON() ));
     		return this;
	    },
	
		



  });
  return PersonInfoboxView;
});