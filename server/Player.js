class Player{
	constructor(playerID){
		this.id = playerID;
		this.name = "";
		this.tableID = "";
		this.hand = [];
		this.status = "";
		this.turnFinished = "";
	}

	setName(name){
		this.name = name;
	}

	getName(){
		return this.name;
	}

	setTableID(tableID){
		this.tableID = tableID;
	}

	getTableID(){
		return this.tableID;
	}

	setCards(cards){
		this.cards = cards;
	}

	getCard(){
		return this.cards;
	}

	setStatus(status){
		this.status = status;
	}

	isAvailable(){
		return this.status === "available";
	}

	isInTable(){
		return this.status === "intable";
	}

	isPlaying(){
		return this.status === "playing";
	}
}


module.exports = Player;
