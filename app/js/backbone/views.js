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
			"click .name" : 'onClick'
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
			console.log("IN REFRESH \n\n\n\n ")
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
		},
		
		onFocusChange : function(){
			if(this.model.get("is_focus")===true){this.$el.addClass('is_focus');			
			}else{this.$el.removeClass('is_focus');	}
		}
		
	});
	
	ScotusViewer.Views.PersonMugBox = Backbone.View.extend({
		tagName: 'div',
		className: 'person mugbox selector is_visible',
		template : _.template($('#template-person-mugbox').html()), 
		events : {
			"click .name" : 'onClick'
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
		mugbox_size : 140,
		initialize : function(){
			_.bindAll(this, "render", "onPersonSelected", 'onPersonVisible', 'fixMargins');
			
			this.person = this.model.person;
			this.person.on('change:is_visible', this.onPersonVisible);
			this.person.on('change:is_selected', this.onPersonSelected);
			this.is_justice = this.model.is_justice;
		},
		
		render : function(){
			var self = this;
			this.$el.html(self.template(self.model.toJSON()));
			this.person_mug_box = new ScotusViewer.Views.PersonMugBox({model:this.person});
			this.text_box = this.$(".text");
	
			var tw = self.is_justice ? this.$('.person-wrap.SCOTUS') : this.$('.person-wrap.Party');
			tw.html(self.person_mug_box.render().el);
			
			
			return this;	        
		},
		
		fixMargins: function(){
			var tdim = this.mugbox_size - this.text_box.height();			
			if(tdim > 0){
				this.text_box.css({marginTop: tdim/2 });
				if(this.text_box.text().length < 140){
					this.$el.addClass("brief");
				}
				
			}else{
				this.person_mug_box.$el.css({marginTop: -tdim/3 });
			}
			
			
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
		},
		
		
		onPersonFocusChange : function(){
			if(this.person.get("is_focus")===true){this.$el.addClass('is_focus');			
			}else{this.$el.removeClass('is_focus');	}
		}
	});
	
	
	
	
	/* other views */
	ScotusViewer.Views.TranscriptGraph = Backbone.View.extend({
		/* el should be provided*/
		
		initialize : function(){
			_.bindAll(this, "render", "updateTick", "getScrollPosition");
			var self = this;
			
			this.transcript_height = $(document).height();
			
			// not very backbony but whatever
			$(window).scroll(function(){self.updateTick();})
		},
		
		render : function(){
			this.$el.html("<div id=\"transcript-graph-pin\"></div>");
			this.pin = this.$("#transcript-graph-pin");
			return this;
		},
		
		getScrollPosition : function(with_pct){
			// pre: uses the window object
			// returns: decimal value, 0 - 1.0, representing relative position of window
			this.transcript_height = $(document).height();
			
			var t =  parseFloat($(document).scrollTop()) / parseFloat(this.transcript_height);
			
			return with_pct === true ? t * 100 + "%" : t;
		},
		
		updateTick : function(e){
			var t = this.getScrollPosition(true);
			this.pin.css({left:t});
			
			console.log('update tick: ' + t + "   transcriptheight: " + this.transcript_height);
		}
		
	});
	
	
	
});
