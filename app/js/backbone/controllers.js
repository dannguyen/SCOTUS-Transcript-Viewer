$(function(){
	ScotusViewer.App = Backbone.View.extend({
		defaults: {
		},
	
		initialize : function(){
			_.bindAll(this, "render", "onPersonClick",
			'onHearingDateClick', 'refreshInfoBoxes', 'attachPanelToInfobox', 'onClickFocus', 'focusPerson', 'onClickGotoStatement', 'gotoStatement');
			this.people = new Backbone.Collection();
			this.speeches = new Backbone.Collection();
			this.hearings = new Backbone.Collection();
			this.transcript_graph = new ScotusViewer.Views.TranscriptGraph({el:'#transcript-graph'});

			this.speech_segments = [];
			this.selected_person = null;
			this.focused_person = null;
		
			// sub views
			
		},
		render : function(){
			var self = this;
		
			// this is spaghetti
			this.side_panel =$( $("#template-people-side-panel").html());
			this.$el.append(this.side_panel);
			
			this.transcript_graph.render();
			this.$('.appx.all-visible').click(function(){ self.onPersonClick();});
			this.$('.appx.focus-statement').click(function(){ self.onClickFocus(true);});
			this.$('.appx.next-statement').click(function(){ self.onClickGotoStatement(1);});
			this.$('.appx.prev-statement').click(function(){ self.onClickGotoStatement(-1);});
			return this;	        
		},
		
		
		attachPanelToInfobox : function(p){
			var target_box = this.$('#infobox-' + p.cid + " .panel-wrap"); 
			this.side_panel.detach();

			target_box.append(this.side_panel); 
	//		target_box.append(this.side_panel);
//			this.side_panel.show();
		},
		
		prettify : function(){
			var self = this;
			_.each(self.speech_segments, function(_s){_s.fixMargins();});
		},
		
		refreshInfoBoxes : function(){
			this.people.each(function(p){p.refresh();});
		},
	
		onClickGotoStatement : function(num){
			
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
			var set_all_visible = _.isUndefined(obj) || obj.model == this.selected_person;		

			//mmmm spaghetti
			
			if(!set_all_visible){
				var person = obj.model;
				this.selected_person = person;	
				this.attachPanelToInfobox(this.selected_person);
//				this.people.each(function(p){ if(p != person){ p.set({'is_selected':false});}});
				this.people.each( function(p){ 
					if(p != person){ 
						p.set({is_selected:false, is_visible:false});
					}else{ p.set({is_selected:true, is_visible: true}); }
				});					
			}else{
				var person = null;
				this.selected_person = null;
				this.people.each(function(p){  p.set({is_visible:true, is_selected:false}); } );				
			}


			
		},
		
		onClickFocus : function(focus_val){
			var s_person = this.selected_person;
			var do_focus =  s_person && focus_val == true;
			this.focusPerson(do_focus);	
		},
		
		focusPerson : function(do_focus){
			if(do_focus === true){
				var fp = this.selected_person;
				this.$('.appx.focus-statement').addClass('focus')
				this.people.each(function(p){
					if(p != fp){p.display_speeches(false);
					}else{ p.display_speeches(true); }});
			}else{
				this.$('.appx.focus-statement').removeClass('focus');
				this.people.each(function(p){  p.display_speeches(true); } );	
			}
			
		
			
		},
	
		onClickGotoStatement : function(){
			
		},
	
		gotoStatement : function(){
			
		},
		
		
	
	});

});















// intiation

$(function(){
	ScotusViewer.app = new ScotusViewer.App({el:"#scotus-case-viewer-app"});
	ScotusViewer.transcript_viewer = $("#transcript-view");
	ScotusViewer.transcript_navbar = $("#transcript-navbar");
	ScotusViewer.hearing_date_navbar = $("#hearing-date-navbar");
	ScotusViewer.people_panel = $("#people-panel");
	
	
	
 	$.getJSON(DATA_FILENAME, function(data) {
	
		_.chain(data.people).sortBy(function(_p){return _p.category;}).each(function(pers){
			var person = new ScotusViewer.Models.Person(pers);
			console.log(person.get("key_name"))
			ScotusViewer.app.people.add(person);
			
			var pbox = new ScotusViewer.Views.PersonInfoBox({model:person, id: "infobox-"+person.cid});
			ScotusViewer.people_panel.append(pbox.render().el);
			
		});
		
		
		var hearings = data.hearings;
		console.log("Number of hearings: " + hearings.length);
		
		_.each(hearings, function(hr){
			console.log("Number of speeches: " + hr.speeches.length);
			
			var hearing = new ScotusViewer.Models.Hearing(hr);
			ScotusViewer.app.hearings.add(hearing);
			var hearing_segment = new ScotusViewer.Views.HearingSegment({model:hearing, id:"hearing-segment-"+hearing.cid});
			var hearing_datebox = new ScotusViewer.Views.HearingDatebox({model:hearing, id:"hearing-datebox-"+hearing.cid});
			ScotusViewer.transcript_viewer.append(hearing_segment.render().el);
			ScotusViewer.hearing_date_navbar.append(hearing_datebox.render().el);
			
			_.each(hr.speeches, function(sch){
				
				var s_person = ScotusViewer.app.people.find(function(_p){
					return _p.get('key_name') === sch.person_key_name; }
				); 	
				
				sch.person = s_person;

				var speech = new ScotusViewer.Models.Speech(sch);				
				speech.hearing_id = hearing.cid; // needed? TK
				
				
				ScotusViewer.app.speeches.add(speech);
				s_person.speeches.add(speech);
				hearing.speeches.add(speech);
				
				var speech_segment = new ScotusViewer.Views.SpeechSegment({model:speech, id:"speech-segment-"+speech.cid});
				ScotusViewer.app.speech_segments.push(speech_segment); // bad separation of concerns TK
				
				hearing_segment.$el.append(speech_segment.render().el);
			});
						
		});
		// done with each hearing
		
		
		//update stats
		ScotusViewer.app.render();
		ScotusViewer.app.refreshInfoBoxes();
		ScotusViewer.app.prettify();
		
	});
});