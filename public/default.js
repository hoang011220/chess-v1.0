
var board;
var game;

window.onload = function(){
	initGame();
}

var socket =io();

socket.on("Server-send-dk-thatbai", function(){
	alert("Da co nguoi dang ky!!!");
});

socket.on("Server-send-dk-thanhcong", function(data){
	$("#nguoiChoi2").html(data);
	$("#loginForm").hide(2000);
	$("#game").show(1000);
});



$(document).ready(function(){
	$("#game").show();
	$("#loginform").hide(2000);

	$("#btnRegister").click(function(){
		socket.emit("client-send-Username", $("#txtUsername").val());
	});
});


var initGame = function(){
	var cfg =  {
		draggable: true,
		position: 'start',
		onDrop: handleMove,
	}

	board = new ChessBoard('gameBoard', cfg);
	game = new Chess();
};

var handleMove = function(source, target){
	var move = game.move({from: source, to: target});
	if(move==null) return 'snapback';
	else { socket.emit("move", move);
	socket.emit("history", {from:source, to:target})
	}
}

socket.on('move', function(msg){
	game.move(msg);
	board.position(game.fen());
});

socket.on('history', function(data){
	$("#listHistory").append("<div class='htr'>"+data.from+" "+data.to+"</div>");
});
