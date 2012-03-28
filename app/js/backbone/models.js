/* SCOTUS viewer Models */

$(function(){
	ScotusViewer.Models.Hearing = Backbone.Model.extend({
		defaults : {
			is_visible : true,
			is_selected: false
		}
	});	
	
	
	ScotusViewer.Models.Person = Backbone.Model.extend({
		defaults: { party : '',
			is_visible : true,
			is_selected: false
		},
		
		initialize : function(){
			this.speeches = new Backbone.Collection();
			this.key_name = this.get('key_name');
			_.bindAll(this, "countWords", "countCurrentWords", "countSpeeches", "countCurrentSpeeches", "refresh");
			
		},
		
		refresh : function(){
			this.trigger("refresh");
		},
		
		countWords : function(){
			return this.speeches.reduce(
				function(memo, _s){return memo + _s.word_count; }
				, 0 );
		},
		
		countCurrentWords : function(){
			console.log("current words, before: speeches length: " + this.speeches.length);
			return this.countWords();
		},
		
		countSpeeches : function(){
			return this.speeches.length;
		},
		
		countCurrentSpeeches : function(){
			console.log(this.speeches.length)
			return this.speeches.length;
			
			return this.speeches.select(function(_s){return _s.get("is_visible") == true }).length;
		}
		
		
		
	});	
	
	ScotusViewer.Models.Speech = Backbone.Model.extend({
		defaults : {
			is_visible : true,
			is_selected: false
		},
		
		initialize : function(){
//			_.bindAll(this, '');
			this.person = this.get('person');
			this.word_count = this.get('word_count');
			
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
