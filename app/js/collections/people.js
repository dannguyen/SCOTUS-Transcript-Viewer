define([
  'underscore', 
  'backbone',
  'models/person'
  ], function(_, Backbone, PersonModel){
		
  	var PeopleCollection = Backbone.Collection.extend({
		
		model: PersonModel,
		
		getFocused : function(){
			return this.find(function(_m){return _m.get('is_focus') === true; });
		},

	    focusOn : function(m){
			if( g = this.getFocused()){
				if(g!=m){g.set({is_focus:false}); m.set({is_focus:true});}
			}else{
				m.set({is_focus:true});
			};
			/*
			this.each(function(_m){
				if(_m == m){
					_m.set({is_focus:true});
				}else{
					_m.set({is_focus:false});										
				}
			});*/
		},
		
		focusOff : function(){
			// assumes there is only one focused object
			var g = this.getFocused();
			if(g){g.set({is_focus:false} ); }
		},
		
		filterUnfocused : function(){
			return this.chain().filter(function(g){return g.get('is_focus')==false});
		}
	   


  });
  return PeopleCollection;
});