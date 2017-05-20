Game = require('./Game.js');

class Table {
  constructor(tableID) {
    this.id = tableID;
  	this.name = "";
  	this.status = "available";
  	this.players = [];
  	this.playersID = [];
  	this.readyToPlayCounter = 0;
  	this.playerLimit = 2;
  	this.pack = [];
  	this.discardPile = [];
    this.round=3;
  	this.forcedDraw = 0;

  	this.gameObj = null;
  }

  progressRound(player){
    for(var i = 0; i < this.players.length; i++) {
      this.players[i].turnFinished = false;
        if(this.players[i].id == player.id) { //when player is the same that plays, end their turn
        player.turnFinished = true;
      }
    }
  }

  setName(name){
    this.name = name;
  }

  getName(){
    return this.name;
  }

  setStatus(status){
    this.status = status;
  }

  isAvailable(){
    return this.status === "available";
  }

  isFull(){
    return this.status === "full";
  }

  isPlaying(){
    return this.status === "playing";
  }

  addPlayer(player){
    if(this.status === "available"){
      var found = false;
      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].id == player.id) {
          found = true;
          break;
        }
      }

      if(!found){
        this.players.push(player);
        if (this.players.length == this.playerLimit) {
          for(var i = 0; i < this.players.length; i++){
  					this.players[i].status = "intable";
  				}
        }
        return true;
      }
    }
    return false;
  }

  removePlayer(player){

    var index = -1;
  	for(var  i = 0; i < this.players.length; i++){
      console.log(this.players[i].id);
      console.log(player.id);
  		if(this.players[i].id === player.id){
  			index = i;
  			break;
  		}
  	}
  	if(index != -1){
  		this.players.splice(index,1);
  	}
  }

  isTableAvailable(){
    if( (this.playerLimit >= this.players.length) && (this.status === "available")){
      return true;
    } else {
      return false;
    }
  }

  createMessageObject(){
    var table = this;
    var TableMessage = function(){
      this.id = table.id;
  		this.name = table.name;
  		this.status = table.status;
  		this.players = table.players;
  		this.playerLimit = table.playerLimit;
    }

    return new TableMessage();
  }

  getRound(){
    return this.round;
  }
  updateRound(){
    this.round--;
    return this.round;
  }

}

module.exports = Table;
