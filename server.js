var http = require("http");
var express = require("express");
var api = require("./server/routes/api");
var logger = require("morgan");
var path = require("path");
var fs = require("fs");
var websocket = require("ws");

var app = express();

var lastMessage = null;

app.use(logger("short"));

app.use(express.static(path.resolve(__dirname, "dist")));

app.use("/api", api);

app.get("*", function(req, res){
  res.sendFile("dist/index.html");
});


const server = http.createServer(app);
var wss = new websocket.Server({server});

wss.broadcast = function broadcast(data, ws) {
  wss.clients.forEach(function each(client) {
    if(client !== ws){
      client.send(data, function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Broadcasted")
        }
      });
    }

  });
};

wss.on('connection', function(ws){
  if(lastMessage != null){
    ws.send(lastMessage);
  }
  ws.on('message', function(message){
    console.log("Received " + JSON.stringify(message));
    lastMessage = message;
    wss.broadcast(message, ws);
  })
});

server.listen(3200, function () {
  console.log("Listening on port 3200");
});
