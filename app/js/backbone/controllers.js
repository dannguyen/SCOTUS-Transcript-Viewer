ScotusViewer.App = Backbone.View.extend({
	defaults: {
	},
	
	initialize : function(){
		_.bindAll(this, "render", "onPersonClick",
		'onHearingDateClick', 'refreshInfoBoxes');
		this.people = new Backbone.Collection();
		this.speeches = new Backbone.Collection();
		this.hearings = new Backbone.Collection();
		
		var self = this;
	},
	render : function(){
		var self = this;
//		this.$('#transcript-navbar').css({position:'fixed'});
		this.$('.appx.all-visible').click(function(){self.onPersonClick();})
		return this;	        
	},
		
	refreshInfoBoxes : function(){
		this.people.each(function(p){p.refresh();});
	},
	
	onHearingDateClick : function(obj){
		var set_all_visible = _.isUndefined(obj);
				
		if(!set_all_visible){
			var hearing = obj.model;
			var h_s = !hearing.get('is_selected');
			hearing.set({is_selected:h_s});			
		}else{
			var hearing = false, h_s = false;
		}
		this.hearings.each(function(h){ if(h != hearing){ h.set({'is_selected':false});}});
		
		if(h_s){
			this.hearings.each(function(p){ if(p != hearing){p.set({'is_visible':false});}else{p.set({'is_visible':true})}});
		}else{
			this.hearings.each(function(p){  p.set({'is_visible':true}); } );
		}
		
		this.refreshInfoBoxes();
		
	},
	
	onPersonClick : function(obj){
		var set_all_visible = _.isUndefined(obj);		
		if(!set_all_visible){
			var person = obj.model;
			var p_s = !person.get('is_selected')
			person.set({is_selected:p_s});			
		}else{
			var person = false, p_s = false;
		}

		this.people.each(function(p){ if(p != person){ p.set({'is_selected':false});}});
		
		if(p_s){
			this.people.each(function(p){ if(p != person){p.set({'is_visible':false});}else{p.set({'is_visible':true})}});
		}else{
			this.people.each(function(p){  p.set({'is_visible':true}); } );
		}		
	},
	
	
	
});