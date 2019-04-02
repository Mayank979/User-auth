let socket = io.connect("localhost:8000");

socket.on("connect", () => {
  $("#incoming-msg").append("Connected to server" + "</br>");
socket.on("newUser", (data) => {
  $("#incoming-msg").append(data.from + " " + data.text + "</br>");
});

});


socket.on("newMsg", (data) => {
  $("#incoming-msg").append(data.from + " " + data.text + "</br>");
});

socket.on("disconnect", () => {
  console.log("disconnected");
});

$("#message-form").on("submit", (e) => {
  e.preventDefault();
  socket.emit("createMsg", {
    from: 'Mayank',
    text: $("#data").val()
  }, function(mesg){
    console.log(mesg);
  });
  $("#data").val("");
});
