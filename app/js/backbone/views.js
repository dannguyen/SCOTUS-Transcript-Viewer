/* SCOTUS viewer Views */
$(function(){
	ScotusViewer.Views.Hearing = Backbone.View.extend({
		tagName: 'div',
		className: 'hearing'
	});
	
	ScotusViewer.Views.PersonInfoBox = Backbone.View.extend({
		tagName: 'div',
		className: 'person infobox selected selector',
		template : _.template($('#template-person-infobox').html()), 
		events : {
			"click" : 'onClick'
		},
		
		initialize : function(){
			_.bindAll(this, "render", "onClick", "onSelectChange");
			this.model.on("change:is_selected", this.onSelectChange);
		},
		render : function(){
			var self = this;
			this.$el.html(self.template(self.model.toJSON()));
			return this;	        
		},
		
		onClick : function(){
			ScotusViewer.app.onPersonClick(this);			
		//	this.model.set({is_selected:!this.model.get('is_selected')});
		},
		
		onSelectChange : function(){
			if(this.model.get("is_selected")===true){
				this.$el.addClass('selected');				
			}else{
				this.$el.removeClass('selected');	
			}
		}
	});
	
	ScotusViewer.Views.PersonMugBox = Backbone.View.extend({
		tagName: 'div',
		className: 'person mugbox selected selector',
		template : _.template($('#template-person-mugbox').html()), 
		events : {
			"click" : 'onClick'
		},
		
		initialize : function(){
			_.bindAll(this, "render", "onClick", "onSelectChange");
			this.model.on("change:is_selected", this.onSelectChange);
		},
		render : function(){
			var self = this;
			this.$el.html(self.template(self.model.toJSON()));
			return this;	        
		},
		
		onClick : function(){
			ScotusViewer.app.onPersonClick(this);
//			this.model.set({is_selected:!this.model.get('is_selected')});
		},
		
		onSelectChange : function(){
			if(this.model.get("is_selected")===true){
				this.$el.addClass('selected');				
			}else{
				this.$el.removeClass('selected');	
			}
		}
	});	
	
	
	/* Speech views */
	
	ScotusViewer.Views.SpeechSegment = Backbone.View.extend({
		tagName: 'div',
		className: 'speech segment clearfix selected',
		template : _.template($('#template-speech-segment').html()), 
		initialize : function(){
			_.bindAll(this, "render", "onPersonSelect");
			this.person = this.model.person;
			this.person.on('change:is_selected', this.onPersonSelect)
		},
		
		render : function(){
			var self = this;
			this.$el.html(self.template(self.model.toJSON()));
			this.person_mug_box = new ScotusViewer.Views.PersonMugBox({model:this.person});
			this.$('.person-wrap').append(self.person_mug_box.render().el);
			return this;	        
		},
		
		onPersonSelect : function(){
			if(this.person.get("is_selected")===true){
				this.$el.addClass('selected');				
			}else{
				this.$el.removeClass('selected');	
			}
		}
	});
	
	
	
});
