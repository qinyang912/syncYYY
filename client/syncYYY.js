;(function(Global){
	console.log("init syncYYY");
	console.log("Event prototype %o",Event.prototype.stopPropagation)
	var __stopPropagation = Event.prototype.stopPropagation;
	Event.prototype.stopPropagation = function(){
		console.log("stopPropagation this %o",this);
		return __stopPropagation.apply(this);
	}
})(window);