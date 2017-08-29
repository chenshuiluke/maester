var http = require("http");
var express = require("express");
var api = require("./server/routes/api");
var logger = require("morgan");
var path = require("path");
var fs = require("fs");
var websocket = require("ws");

var app = express();

app.use(logger("short"));

app.use(express.static(path.resolve(__dirname, "dist")));

app.use("/api", api);

app.get("*", function(req, res){
  res.sendFile("dist/index.html");
});


const server = http.createServer(app);
var wss = new websocket.Server({server});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data, function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("Broadcasted")
      }
    });
  });
};

wss.on('connection', function(ws){
  ws.on('message', function(message){
    console.log("Received " + JSON.stringify(message));
    wss.broadcast(message);
  })
});

server.listen(3000, function () {
  console.log("Listening on port 3000");
});
