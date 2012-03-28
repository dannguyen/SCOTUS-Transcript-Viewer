window.DATA_FILENAME = 'data-hold/11-398--Department of Health and Human Servs. v. Florida--.js'
window.ScotusViewer = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
};

$(function(){
	ScotusViewer.app = new ScotusViewer.App({el:"#scotus-case-viewer-app"});
	ScotusViewer.app.render();
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
				
				console.log("PErson: " + s_person.key_name + ": " + s_person.speeches.length)
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
		ScotusViewer.app.refreshInfoBoxes();
		
	});
});