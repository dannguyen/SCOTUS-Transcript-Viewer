$(function(){
	ScotusViewer.App = Backbone.View.extend({
		defaults: {
		},
	
		initialize : function(){
			_.bindAll(this, "render", "onPersonClick",
			'onHearingDateClick', 'refreshInfoBoxes');
			this.people = new Backbone.Collection();
			this.speeches = new Backbone.Collection();
			this.hearings = new Backbone.Collection();
			this.transcript_graph = new ScotusViewer.Views.TranscriptGraph({el:'#transcript-graph'});
		
			// sub views
		},
		render : function(){
			var self = this;
		
			// this is spaghetti
			this.transcript_graph.render();
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

});



// intiation

$(function(){
	ScotusViewer.app = new ScotusViewer.App({el:"#scotus-case-viewer-app"});
	ScotusViewer.transcript_viewer = $("#transcript-view");
	ScotusViewer.transcript_navbar = $("#transcript-navbar");
	ScotusViewer.hearing_date_navbar = $("#hearing-date-navbar");
	ScotusViewer.sidebar = $("#sidebar");
	
	
	
 	$.getJSON(DATA_FILENAME, function(data) {
	
		_.each(data.people, function(pers){
			var person = new ScotusViewer.Models.Person(pers);
			console.log(person.get("key_name"))
			ScotusViewer.app.people.add(person);
			
			var pbox = new ScotusViewer.Views.PersonInfoBox({model:person});
			ScotusViewer.sidebar.append(pbox.render().el);
			
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
					return _p.get('key_name') == sch.speaker_key; }
				); 	
				
				sch.person = s_person;

				var speech = new ScotusViewer.Models.Speech(sch);
				
				speech.hearing_id = hearing.cid;
				
				ScotusViewer.app.speeches.add(speech);
				s_person.speeches.add(speech);
				hearing.speeches.add(speech);
				
				var speech_segment = new ScotusViewer.Views.SpeechSegment({model:speech, id:"speech-segment-"+speech.cid});
				hearing_segment.$el.append(speech_segment.render().el);
			});
						
		});
		// done with each hearing
		
		
		//update stats
		ScotusViewer.app.render();
		ScotusViewer.app.refreshInfoBoxes();
		
	});
});