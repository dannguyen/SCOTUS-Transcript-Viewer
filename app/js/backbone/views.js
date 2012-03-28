/* SCOTUS viewer Views */
$(function(){
	ScotusViewer.Views.HearingSegment = Backbone.View.extend({
		tagName: 'section',
		className: 'hearing segment',
		initialize: function(){
			_.bindAll(this, "render", "onSelectedChange", "onVisibleChange");
			this.model.on("change:is_visible", this.onVisibleChange);
			this.model.on("change:is_selected", this.onSelectedChange);
		},
		render: function(){
			return this;
		},
		onVisibleChange : function(){
			console.log("hearing segment change visiblity")
			if(this.model.get("is_visible")===true){this.$el.show();				
			}else{this.$el.hide();	}
		},

		onSelectedChange : function(){
			if(this.model.get("is_selected")===true){this.$el.addClass('is_selected');			
			}else{this.$el.removeClass('is_selected');	}
		}
	});
	
	ScotusViewer.Views.HearingDatebox = Backbone.View.extend({
		tagName: 'div',
		className: 'hearing datebox selector is_visible',
		events: {
			'click' : 'onClick'
		},
		initialize: function(){
			_.bindAll(this, "render", "onClick", "onSelectedChange", "onVisibleChange");
			this.model.on("change:is_visible", this.onVisibleChange);
			this.model.on("change:is_selected", this.onSelectedChange);
		},
		
		render: function(){
			this.$el.html("<strong>"+this.model.cid+"</strong>")
			return this;
		},
		onClick : function(){
			ScotusViewer.app.onHearingDateClick(this);			
		},
		onVisibleChange : function(){
			if(this.model.get("is_visible")===true){this.$el.addClass('is_visible');				
			}else{this.$el.removeClass('is_visible');	}
		},

		onSelectedChange : function(){
			if(this.model.get("is_selected")===true){this.$el.addClass('is_selected');			
			}else{this.$el.removeClass('is_selected');	}
		}
	});
	
	
	ScotusViewer.Views.PersonInfoBox = Backbone.View.extend({
		tagName: 'div',
		className: 'person infobox selector is_visible',
		template : _.template($('#template-person-infobox').html()), 
		events : {
			"click" : 'onClick'
		},
		
		initialize : function(){
			_.bindAll(this, "render", "refresh", "onClick", "onSelectedChange", "onVisibleChange");
			this.model.on("change:is_visible", this.onVisibleChange);
			this.model.on("change:is_selected", this.onSelectedChange);
			this.model.on("refresh", this.refresh);
			
		},
		render : function(){
			var self = this;
			this.$el.html(self.template(self.model.toJSON()));
			return this;	        
		},
		
		refresh : function(){
			this.updateStats();
		},
		
		updateStats : function(){
			this.$('.word_count .current').text(this.model.countCurrentWords());
			this.$('.speech_count .current').text(this.model.countCurrentSpeeches());
		},
		
		onClick : function(){
			ScotusViewer.app.onPersonClick(this);			
		//	this.model.set({is_visible:!this.model.get('is_visible')});
		},
		
		onVisibleChange : function(){
			if(this.model.get("is_visible")===true){this.$el.addClass('is_visible');				
			}else{this.$el.removeClass('is_visible');	}
		},

		onSelectedChange : function(){
			if(this.model.get("is_selected")===true){this.$el.addClass('is_selected');			
			}else{this.$el.removeClass('is_selected');	}
		}
	});
	
	ScotusViewer.Views.PersonMugBox = Backbone.View.extend({
		tagName: 'div',
		className: 'person mugbox selector is_visible',
		template : _.template($('#template-person-mugbox').html()), 
		events : {
			"click" : 'onClick'
		},
		
		initialize : function(){
			_.bindAll(this, "render", "onClick", "onSelectedChange", "onVisibleChange");
			this.model.on("change:is_visible", this.onVisibleChange);
			this.model.on("change:is_selected", this.onSelectedChange);
		},
		render : function(){
			var self = this;
			this.$el.html(self.template(self.model.toJSON()));
			return this;	        
		},
		
		onClick : function(){
			ScotusViewer.app.onPersonClick(this);
		},
		
		onVisibleChange : function(){
			if(this.model.get("is_visible")===true){this.$el.addClass('is_visible');				
			}else{this.$el.removeClass('is_visible');	}
		},
		onSelectedChange : function(){
			if(this.model.get("is_selected")===true){this.$el.addClass('is_selected');			
			}else{this.$el.removeClass('is_selected');	}
		}
	});	
	
	
	/* Speech views */
	
	ScotusViewer.Views.SpeechSegment = Backbone.View.extend({
		tagName: 'div',
		className: 'speech segment clearfix is_visible',
		template : _.template($('#template-speech-segment').html()), 
		initialize : function(){
			_.bindAll(this, "render", "onPersonSelected", 'onPersonVisible');
			this.person = this.model.person;
			this.person.on('change:is_visible', this.onPersonVisible);
			this.person.on('change:is_selected', this.onPersonSelected);
		},
		
		render : function(){
			var self = this;
			this.$el.html(self.template(self.model.toJSON()));
			this.person_mug_box = new ScotusViewer.Views.PersonMugBox({model:this.person});
			this.$('.person-wrap').append(self.person_mug_box.render().el);
			return this;	        
		},
		
		onPersonSelected : function(){
			if(this.person.get("is_selected")===true){
				this.$el.addClass('is_selected');				
			}else{
				this.$el.removeClass('is_selected');	
			}
		},
		
		onPersonVisible : function(){
			if(this.person.get("is_visible")===true){
				this.$el.addClass('is_visible');				
			}else{
				this.$el.removeClass('is_visible');	
			}
		}
	});
	
	
	
});
