/**
 * [description]
 * @param  {[type]} Global
 * @param  {[type]} io
 * @return {[type]}
 */
;(function(Global,io){
	var __stopPropagation = Event.prototype.stopPropagation;

	Event.prototype.stopPropagation = function(){
		console.log("stopPropagation this %o",this);
		console.log("Element.prototype %o",Element.prototype);
		console.log("EventTarget.prototype %o",EventTarget.prototype);
		return __stopPropagation.apply(this);
	}
	document.addEventListener('click',function(e){
		console.log("document e %o",e);
	});
	var getSelector = function(element){
		var tagName = element.tagName.toLowerCase();
		var trim = function(string){
			return string && string.replace(/^\s+|\s+$/,"") || string;
		}
		//去掉一些使用时间戳作为ID的元素
		if(element.id && !(/\d{13}/).test(element.id) && !(/^\d+$/).test(element.id)){
			return '#' + element.id;
		}

		if(element == document || element == document.documentElement){
			return 'html';
		}

		if(element == document.body){
			return 'html>' + tagName;
		}
		if(!element.parentNode){
			return tagName;
		}
		var ix = 0,
			siblings = element.parentNode.childNodes,
			elementTagLength = 0,
			className = trim(element.className);
		for(var i = 0, l = siblings.length; i < l; i++){
			if(className){
				if(trim(siblings[i].className) === className){
					++elementTagLength;
				}
			}else{
				if((siblings[i].nodeType == 1) && (siblings[i].tagName === element.tagName)){
					++elementTagLength;
				}
			}
		}
		for(var i = 0,l = siblings.length; i < l; i++){
			var sibling = siblings[i];
			if(sibling === element){
				return arguments.callee(element.parentNode) + '>' + (className ? "." + className.replace(/\s+/g,"") : tagName) + ((!ix && elementTagLength === 1) ? '' : ':nth-child('+ (ix + 1) +')');
			}else if(sibling.nodeType ==1){
				ix++;
			}
		}
	}
})(window,io);