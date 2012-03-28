/* SCOTUS viewer Models */

$(function(){
	ScotusViewer.Models.Hearing = Backbone.Model.extend({
		defaults : {
			is_visible : true,
			is_selected: false
		},
		initialize : function(){
			this.speeches = new Backbone.Collection();
			var self = this;
			this.on("change:is_visible", function(){
				//warning untested
				self.speeches.each(function(_s){
					console.log("a speech  " + _s.cid);
					_s.set({is_visible:self.get('is_visible')},
				 {silent: true}
				);})
			});
		},
		
		
	});	
	
	
	ScotusViewer.Models.Person = Backbone.Model.extend({
		defaults: { party : '',
			is_visible : true,
			is_selected: false,
			is_focus: false,
			first_name: null, last_name: null, middle_name: null, position: null, start_date: null, birth_date: null, suffix: null
		},
		
		initialize : function(){
			this.set({'party_canon' : this.get('party').replace(/\s/, '')});
			this.speeches = new Backbone.Collection();
			this.key_name = this.get('key_name');
			this.is_justice = this.get('category') == 'SCOTUS' ? true : false;
						
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
			return this.speeches.reduce(
				function(memo, _s){return _s.get("is_visible") == true ? memo + _s.word_count : memo }, 0);
		},
		
		countSpeeches : function(){
			return this.speeches.length;
		},
		
		countCurrentSpeeches : function(){
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
			this.is_justice = this.person.is_justice;
			
			
			this.set({
				page_marker : this._page_marker(),
				person_category : this.person.get('category')
				/*
				,
				person_last_name : this.person.get('last_name'),
				person_key_name : this.person.get('key_name')*/
			});
			
			// cache key name
			this.person_key_name = this.get('person_key_name');
		},
		
		_page_marker : function(){
			var start = this.get('start_position'), end = this.get('end_position');
			var str = "pg." + start['page'] + ', ';
			str += start['page'] == end['page'] ?  "lines: " + start['line'] + "-" + end['line'] : " line: " + start['line'] + " - pg: " + end['page'] + ", line: " + end['line'];
			return str;
		}
		
	});	
	
});
