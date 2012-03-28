/* SCOTUS viewer Models */

$(function(){
	ScotusViewer.Models.Hearing = Backbone.Model.extend({
	
	});	
	
	
	ScotusViewer.Models.Person = Backbone.Model.extend({
	
	});	
	
	ScotusViewer.Models.Speech = Backbone.Model.extend({
		defaults : {
			is_selected : true
		},
		
		initialize : function(){
			this.person = this.get('person');
			
			this.set({
				person_category : this.person.get('category'),
				person_last_name : this.person.get('last_name'),
				person_key_name : this.person.get('key_name')
			});
			
			// cache key name
			this.person_key_name = this.get('person_key_name');
		}	
	});	
	
});
