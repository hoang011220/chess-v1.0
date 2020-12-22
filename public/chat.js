var socket =io();

socket.on("Server-send-message", function(data){
	$("#listMessages").append("<div class='ms'>"+data.un+":"+data.nd+"</div>");
});

$("#btnSendMessage").click(function(){
	socket.emit("User-send-message", $("#txtMessage").val());
});
