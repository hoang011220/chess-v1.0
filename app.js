var express = require('express');
var app = express();
app.use(express.static('public'));
var http = require('http').Server(app);
var port = process.env.PORT || 3000;

var io = require('socket.io')(http);

var mangUsers=[];

io.on('connection', function(socket){
	console.log('new connection');

	socket.on('client-send-Username', function(data){
		if(mangUsers.indexOf(data)>=0){
			socket.emit("Server-send-dk-thatbai");
		} else {
			mangUsers.push(data);
			socket.Username =data;
			socket.emit("Server-send-dk-thanhcong", data);
		}
	});

	socket.on("User-send-message", function(data){
		io.sockets.emit("Server-send-message", {un:socket.Username, nd:data});
	});

	socket.on('move', function(msg){
		socket.broadcast.emit('move', msg);
	});

	socket.on('history', function(data){
		io.sockets.emit('history', data);
	});
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/default.html');
});

http.listen(port, function(){
	console.log('listening on *: '+ port);
});