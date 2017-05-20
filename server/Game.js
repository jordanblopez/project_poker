var Helpers = require("./Helpers.js");
var helpers = new Helpers();
var Deck = require("card-deck");
var Rank = require("poker-hands");

class Game {
  constructor() {
    this.pack = this.createPack();

  }

  createPack(){
    var mainDeck = new Deck([
    'AH','2H','3H','4H','5H','6H','7H','8H','9H','10H','JH','QH','KH',
    'AS','2S','3S','4S','5S','6S','7S','8S','9S','10S','JS','QS','KS',
    'AD','2D','3D','4D','5D','6D','7D','8D','9D','10D','JD','QD','KD',
    'AC','2C','3C','4C','5C','6C','7C','8C','9C','10C','JC','QC','KC'
    ]);

    mainDeck.shuffle();

    return mainDeck;
  }

  drawCard(mainDeck, amount, hand, initial){
    var cards = mainDeck.draw(amount);

    if (!initial) {
      hand.push(hand, cards);
    }
    return cards;
  }

  discard(index, hand, table, mainDeck){

    var card = mainDeck.draw(1);
    var unwantedCard = hand.splice(index,1);
    table.push.apply(table, unwantedCard);

    hand.push(card);
  }

  winner(hand1,hand2){
  
    var hand1_string = hand1.join(" ");
    var hand2_string = hand2.join(" ");


    var winner = Rank.judgeWinner([hand1_string,hand2_string]);
    console.log(winner);
    return  winner;
  }
}

module.exports = Game;
