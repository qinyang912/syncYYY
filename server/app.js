var io = require("socket.io")(3000);
var http = require("http");
var route = require('./route');
var server = http.createServer();
var WebSocket = require('./webSocket');
var webSocket = new WebSocket(io);
server.listen(8088,function(){
	console.log("syncYYY is listening on 8088");
})

server.on('request',function(req,res){
	route(req,res);
})

server.on('connection',function(socket){
	console.log("connection event");
})
server.on('checkContinue',function(req,res){
	console.log("checkContinue event");
})
