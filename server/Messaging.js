Game = require("./Game.js");
Table = require('./Table.js');

class Messaging {
  constructor() {}

  sendEventToAllPlayers(event, message, io, player){
		for (var i = 0; i < player.length; i++) {
			io.sockets.connected[player[i].id].emit(event, message);
		}
	}

  sendEventToAllPlayersButPlayer(event, message, io, players, player){
    for(var i = 0; i < players.length; i++) {
			if(players[i].id != player.id) {
				io.sockets.connected[players[i].id].emit(event, message);
			}
    }
  }

  sendEventToAPlayer(event, message, io, players, player){
    for(var i = 0; i < players.length; i++) {
      if(players[i].id == player.id) {
        io.sockets.connected[players[i].id].emit(event, message);
      }
    }
  }

  createSampleTables(amount){
    var tableList = [];
    for(var i = 0; i < amount; i++){
      var game = new Game();

      var table = new Table(1);
      table.setName("Test Table" + (i + 1));
      table.gameObj = game;

      table.pack = game.pack;
      table.status = "available";
      tableList.push(table);
    }
    return tableList;
  }

  createRoom(amount){}


}

module.exports = Messaging;
