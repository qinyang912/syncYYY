var webSocket = function(io){
	var self = this;
	this.io = io;
	this.io.on('connection',function(socket){
		console.log('socket io connection')
		socket.on('online',function(message){
			console.log('message',message);
		})
		socket.on('eventBroadCast',function(data){
			socket.broadcast.emit('event', data);
			console.log('data ',data);
		})
	})
}
module.exports = webSocket;