
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
		onDrop: onDrop,
		onDragStart: onDragStart,
		onMouseoutSquare: onMouseoutSquare,
		onMouseoverSquare: onMouseoverSquare,
		onSnapEnd: onSnapEnd
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

//hint
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

function removeGreySquares () {
	$('#gameBoard .square-55d63').css('background', '')
}

function greySquare (square) {
	var $square = $('#gameBoard .square-' + square)
  
	var background = whiteSquareGrey
	if ($square.hasClass('black-3c85d')) {
	  background = blackSquareGrey
	}
  
	$square.css('background', background)
}

function onDragStart (source, piece) {
	// do not pick up pieces if the game is over
	if (game.game_over()) return false
  
	// or if it's not that side's turn
	if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
		(game.turn() === 'b' && piece.search(/^w/) !== -1)) {
	  return false
	}
}
  
function onDrop (source, target, piece, newPos, oldPos) {
	removeGreySquares()
  
	// see if the move is legal
	var move = game.move({
	  from: source,
	  to: target,
	  promotion: 'q' // NOTE: always promote to a queen for example simplicity
	})
  
	// illegal move
	if (move === null) return 'snapback'

	//history
	console.log('Piece: ' + piece)
	console.log('New position: ' + target)
	console.log('Old position: ' + source)
	if (game.turn() === 'w')
	{
		document.getElementById("listHistory").innerHTML += "<ol id = \"blackMove\">" + piece + ": " + source + " - " + target +"</ol>"
		document.getElementById("nguoiChoi2").innerHTML = "Your Turn"
		document.getElementById("nguoiChoi1").innerHTML = ""
	}
	else
	{
		document.getElementById("listHistory").innerHTML += "<ol id = \"whiteMove\">" + piece + ": " + source + " - " + target +"</ol>"
		document.getElementById("nguoiChoi1").innerHTML = "Your Turn"
		document.getElementById("nguoiChoi2").innerHTML = ""
	}

}
  
function onMouseoverSquare (square, piece) {
	// get list of possible moves for this square
	var moves = game.moves({
	  square: square,
	  verbose: true
	})
  
	// exit if there are no moves available for this square
	if (moves.length === 0) return
  
	// highlight the square they moused over
	greySquare(square)
  
	// highlight the possible squares for this piece
	for (var i = 0; i < moves.length; i++) {
	  greySquare(moves[i].to)
	}
}
  
function onMouseoutSquare (square, piece) {
	removeGreySquares()
}
  
function onSnapEnd () {
	board.position(game.fen())
}

