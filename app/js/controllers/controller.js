define([
  'order!underscore', 
  'order!backbone',
  'controllers/transcript'
  ], 
   function(_, Backbone, TranscriptController){
		
		var MyControllers = {
			'Transcript' : TranscriptController
		};
		return MyControllers;
	}
);
