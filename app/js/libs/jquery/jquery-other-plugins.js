(function($) {

// taken from
// SO user: http://stackoverflow.com/users/85815/sagi 
// http://stackoverflow.com/questions/2337630/find-html-element-nearest-to-position-relative-or-absolute

	$.fn.closestToTop = function(y){
		var elOffset, top, el, yesel = this.first();
		this.each(function(){
			el = $(this);
	        top = el.offset().top;
			if(y > top){
				yesel = el;
			} 
		 });
		console.log("returning last yesel");
		console.log(yesel)
		return yesel;
		
	};

	$.fn.closestToOffset = function(offset) {
			    var el = null, elOffset, x = offset.left, y = offset.top, distance, dx, dy, minDistance;
			    this.each(function() {
			        elOffset = $(this).offset();

			        if (
			        (x >= elOffset.left)  && (x <= elOffset.right) &&
			        (y >= elOffset.top)   && (y <= elOffset.bottom)
			        ) {
			            el = $(this);
			            return false;
			        }

			        var offsets = [[elOffset.left, elOffset.top], [elOffset.right, elOffset.top], [elOffset.left, elOffset.bottom], [elOffset.right, elOffset.bottom]];
			        for (off in offsets) {
			            dx = offsets[off][0] - x;
			            dy = offsets[off][1] - y;
			            distance = Math.sqrt((dx*dx) + (dy*dy));
			            if (minDistance === undefined || distance < minDistance) {
			                minDistance = distance;
			                el = $(this);
			            }
			        }
			    });
			    return el;
			};
	
})( jQuery );