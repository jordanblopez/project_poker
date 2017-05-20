
require('./server/Game.js');
var Player = require('./server/Player.js');
var Messaging = require('./server/Messaging.js');
var Table = require('./server/Table.js');
var Room = require('./server/Room.js');
var Helpers = require('./server/Helpers.js');

var express = require('express');
var app = express();
var serv = require('http').Server(app);
var io = require('socket.io')(serv);


app.get('/',function(req, res){
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log("Server started.");

var messaging = new Messaging();
var room = new Room("Test Room");

room.tables = messaging.createSampleTables(1);


io.sockets.on('connection', function(socket){

  socket.on('connectToServer',function(data) {
    var player = new Player(socket.id);
    var name = data.name;
    player.setName(name);
    room.addPlayer(player);
    //io.sockets.emit("logging", {message: name + " has connected."});
    console.log(name + " has connected.");
  });

  socket.on('connectToTable', function(data){
    var player = room.getPlayer(socket.id);
    var table = room.getTable(data.tableID);

    if (table.addPlayer(player) && table.isTableAvailable()) {
      player.tableID = table.id;
      player.status = "intable";
      console.log(player.name + " has connected to table: " + table.name);

      if(table.players.length < 2){
        console.log("There is " + table.players.length + " players at this table. The table requires " + table.playerLimit + " players to join");
        console.log("Waiting for other players");
      } else {
        console.log("There is " + table.players.length + " players at this table. Play will begin shortly.");
        var countdown = 1;
        setInterval(function() {
          countdown--;
          io.sockets.emit('timer', { countdown: countdown });
        }, 1000);
      }
    } else {
      console.log("something dun goofed up");
    }
  });

  socket.on("readyToPlay", function(data){
    console.log("ready to play called");
    var player = room.getPlayer(socket.id);
    var table = room.getTable(data.tableID);
    player.status = "playing";
    table.readyToPlayCounter++;

    var randomNumber = Math.floor(Math.random() * table.playerLimit);

    console.log(randomNumber);
    //console.log(table.readyToPlayCounter + " " + table.playerLimit);
    if (table.readyToPlayCounter == table.playerLimit) {
      table.status = "unavailable";

      for (var i = 0; i < table.players.length; i++) {

        table.players[i].hand = table.gameObj.drawCard(table.pack, 5, "", 1);

        var startingPlayerID = table.players[0].id;
        console.log("playerid: " + table.players[i].id);
        console.log("startingPlayerID: " + startingPlayerID);
        if (table.players[i].id == startingPlayerID) {
          table.players[i].turnFinished = false;
          console.log(table.players[i].name + " starts the game.");

          io.sockets.connected[table.players[i].id].emit("play", {
            hand: table.players[i].hand
          });

          io.sockets.connected[table.players[i].id].emit("turn", {
            myturn: true
          });
          console.log("before ready");
          io.to(table.players[i].id).emit("ready", {
            ready: true
          });

          io.sockets.connected[table.players[i].id].emit("cardInHandCount", {cardsInHand: table.players[i].hand.length});
        } else {
          table.players[i].turnFinished = true;
          console.log(table.players[i].name + " will not start the game.");
          io.sockets.connected[table.players[i].id].emit("play", {
            hand: table.players[i].hand
          });
          io.sockets.connected[table.players[i].id].emit("turn", {
            myturn: false
          });
          io.sockets.connected[table.players[i].id].emit("ready", {
            ready: true
          });
          io.sockets.connected[table.players[i].id].emit("cardInHandCount", {
            cardsInHand: table.players[i].hand.length
          });
        }
      }
      io.sockets.emit('updatePackCount', {
        packCount: table.pack.length}
      );
    }
  });

  socket.on("disconnect", function() {
    var player = room.getPlayer(socket.id);
    if (player && player.status === "intable") {

      var table = room.getTable(player.tableID);
      table.removePlayer(player);
      table.status = "available";
      player.status = "available";
      console.log(player.name + " has left the table");
      //io.sockets.emit("logging", {message: player.name + " has left the table."});
    }
  });

  socket.on("discard", function(data){
    var player = room.getPlayer(socket.id);
    var table = room.getTable(data.tableID);

    if(!player.turnFinished){
      var unwantedCard = data.unwantedCard;
      var index = data.index;
      //console.log(unwantedCard);
      table.gameObj.discard(index, player.hand, table.discardPile, table.pack);
      socket.emit("play", {hand: player.hand});
    } else {
      console.log("it's not your turn");
    }

  });

  socket.on("endTurn", function(data){
    var player = room.getPlayer(socket.id);
    var table = room.getTable(data.tableID);
    var round = table.getRound();

    if (round == 0){
      messaging.sendEventToAPlayer("turn", {myturn: false}, io, table.players, player);
      var players = table.players;
      var p1 = players[0].hand;
      var p2 = players[1].hand;


      var winner = table.gameObj.winner(p1,p2);

      console.log("The winner is : " + players[winner].name);
      socket.emit("turn", {won: "yes"});
      //messaging.sendEventToAllPlayersButPlayer("turn", {won: "no"}, io, table.players, player);
      socket.emit("gameover", {gameover: true});


    } else {
      table.updateRound();
      console.log(table.getRound());
      table.progressRound(player);
      messaging.sendEventToAPlayer("turn", {myturn: false}, io, table.players, player);
      messaging.sendEventToAllPlayersButPlayer("turn", {myturn: true}, io, table.players, player);
    }




  });


});
