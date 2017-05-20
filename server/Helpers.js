class Helpers {
  constructor() {
  }

  last(array){
    return array[array.length -1];
  }

  indexOf(array, needle){
    for(var i = 0; i < array.length; i++) {
      if(array[i] === needle) {
        return i;
      }
    }
    return -1;
  }

  has(array){
    var x = {};
    for(var i=0;i<array.length;i++){
      x[array[i]] = '';
    }
    return r;
  }
}

module.exports = Helpers;
