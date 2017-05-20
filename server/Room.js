class Room {
	constructor(name){
		this.players = [];
		this.table = [];
		this.name = name;
		this.tableMax = 4;
	}

	addPlayer(player){
		this.players.push(player)
	}

	removePlayer(player){
		var playerIndex = -1;
		//check to ensure that the player is in the players array
		for (var i = 0; i < this.players.length; i++) {
			if (this.players[i].id == player.id) {
				playerIndex = i;
				break;
			}
		 this.players.remove(playerIndex);
		}
	}

	addTable(table){
		this.tables.push(table);
	}

	removeTable(table){
		var tableIndex = -1;
		for (var i = 0; i < this.tables.length; i++) {
			if (this.tables[i].id == table.id) {
				tableIndex = i;
				break;
			}
			this.tables.remove(tableIndex);
		}
	}

	getPlayer(playerID){
		var player = null;
		for(var i = 0; i < this.players.length; i++) {
			if(this.players[i].id == playerID) {
				player = this.players[i];
				break;
			}
		}
		return player;
	}

	getTable(tableID){
		var table = null;
		for(var i = 0; i < this.tables.length; i++){
			if(this.tables[i].id == tableID){
				table = this.tables[i];
				break;
			}
		}
		return table;
	}
}

module.exports = Room;
