/**
 * [description]
 * @param  {[type]} Global = window
 * @param  {[type]} io = socket.io
 */
;(function(Global,io){

	/*** common part begin ***/
	var self = this;
	/*** common part end ***/

	/*** socket.io begin ***/
	this.socketIo = io.connect('http://192.168.100.100:3000');
	this.socketIo.on('connect',function(data){
		self.socketIo.emit('online',{message:'i love you'});
	})
	this.socketIo.on('event',function(data){
		console.log('receive event',data);
		var eventType = data.event;
		var selector = data.selector;
		var value = data.value;
		fireEvent(selector,eventType,value);
	})
	/*** socket.io end ***/

	/*** event get begin ***/
	var __stopPropagation = Event.prototype.stopPropagation;
	Event.prototype.stopPropagation = function(){
		var selector = getSelector(this.target);
		if(this.from != 'fireEvent'){
			self.socketIo.emit('eventBroadCast',{event:this.type.toLowerCase(),selector:selector});
		}
		return __stopPropagation.apply(this);
	}
	document.addEventListener('click',function(e){
		console.log('addEventListener click e %o',e);
		var selector = getSelector(e.target);
		// e.target.click();
		if(e.from != 'fireEvent'){
			self.socketIo.emit('eventBroadCast',{event:'click',selector:selector});
		}
	});
	document.addEventListener('focus',function(e){
		console.log('addEventListener focus e %o',e);
		var selector = getSelector(e.target);
		e.target.focus();
		if(e.from != 'fireEvent'){
			self.socketIo.emit('eventBroadCast',{event:'focus',selector:selector});
		}
	},true);
	document.addEventListener('keydown',function(e){
		console.log('addEventListener keydown e %o',e);
		var selector = getSelector(e.target);
		if(e.from != 'fireEvent'){
			var value = e.target.value;
			self.socketIo.emit('eventBroadCast',{event:'keydown',selector:selector,value:value});
		}else{
			e.target.value = e.value;
		}
	})
	document.addEventListener('keypress',function(e){
		console.log('addEventListener keypress e %o',e);
		var selector = getSelector(e.target);
		if(e.from != 'fireEvent'){
			var value = e.target.value;
			self.socketIo.emit('eventBroadCast',{event:'keypress',selector:selector,value:value});
		}else{
			e.target.value = e.value;
		}
	})
	document.addEventListener('keyup',function(e){
		console.log('addEventListener keyup e %o',e);
		var selector = getSelector(e.target);
		if(e.from != 'fireEvent'){
			var value = e.target.value;
			self.socketIo.emit('eventBroadCast',{event:'keyup',selector:selector,value:value});
		}else{
			e.target.value = e.value;
		}
	})
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
	var fireEvent = function(element,event,value){
		var evt;
		var isString = function(it){
			return typeof it === 'string' || it instanceof String;
		}
		element = (isString(element)) ? document.querySelector(element) : element;
		if(document.createEventObject){
			//dispatch for IE
			evt = document.createEventObject();
			evt.from = 'fireEvent';
			evt.value = value;
			return element.fireEvent('on' + event,evt);
		}else{
			//dispatch for fireFox + others
			evt = document.createEvent('HTMLEvents');
			evt.from = 'fireEvent';
			evt.value = value;
			evt.initEvent(event,true,true);//event type,bubbling,cancelable;
			console.log('element.dispatchEvent %o',element.dispatchEvent)
			return !element.dispatchEvent(evt);
		}
	}
	// fireEvent('#input','click');
	/*** event get end ***/
})(window,io);