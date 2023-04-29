const {cars} = require('./Cars/cars3');
const {board} = require('./Baords/board2');
const {deepCopy} = require('./copies');

var field = deepCopy(board);

var placeCars = function (car){  
  if(car.horizontal){
    for (let i=car.column; i<car.length+car.column;i++)
      field[car.row][i] = car.color;
  }
  else if(!car.horizontal){
    for (let i=car.row;i<car.length+car.row;i++)
      field[i][car.column] = car.color;
  }
}

 for (let key of cars)
   placeCars(key);

//console.log(field);

module.exports.startingField = field;
module.exports.deepCopy = deepCopy;

