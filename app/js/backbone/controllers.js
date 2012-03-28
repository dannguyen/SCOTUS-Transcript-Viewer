ScotusViewer.App = Backbone.View.extend({
	
	initialize : function(){
		_.bindAll(this, "render", "onPersonClick",
		'_selectPerson');
		this.people = new Backbone.Collection();
		this.speeches = new Backbone.Collection();
		
		var self = this;
	},
	render : function(){
		return this;	        
	},
	
	_selectPerson : function(obj){
	},
	
	onPersonClick : function(obj){
		var person = obj.model;
		if(person.get('is_selected')===false){
			this.people.each(function(p){p.set({'is_selected':false});});
		}
		
//		this._selectPerson(obj)
		person.set({is_selected:!person.get('is_selected')});
	},
	
	
	
});