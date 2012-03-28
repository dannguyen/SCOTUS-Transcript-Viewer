window.DATA_FILENAME = 'data-hold/11-398--Department of Health and Human Servs. v. Florida--.js'
window.ScotusViewer = {
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},
};

$(function(){
	ScotusViewer.app = new ScotusViewer.App({el:"#scotus-case-viewer-app"});
	ScotusViewer.transcript_viewer = $("#transcript-view");
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
		
		_.each(hearings, function(hearing){
			console.log("Number of speeches: " + hearing.speeches.length);
			
			_.each(hearing.speeches, function(sch){
				
				sch.person = ScotusViewer.app.people.find(function(_p){
					return _p.get('key_name') == sch.speaker_key; }
				); 	
				var speech = new ScotusViewer.Models.Speech(sch);
				ScotusViewer.app.speeches.add(speech);
				
				var speech_segment = new ScotusViewer.Views.SpeechSegment({model:speech, id:"speech-segment-"+speech.cid});
				ScotusViewer.transcript_viewer.append(speech_segment.render().el);
			});
						
		});
		
	});
});