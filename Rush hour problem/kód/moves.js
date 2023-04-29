const {deepCopy} = require('./startingBoard');

var moveCarUpAndRight = function(car, field){
    let array = deepCopy(field);
    if(car.horizontal){
        if(array[car.row][car.column + car.length] === 0){
            array[car.row][car.column + car.length] = car.color;
            array[car.row][car.column] = 0;
            car.column++;
            return array;
        }
         else
            return null;
    }
    else if(!car.horizontal){
        if(array[car.row - 1][car.column] === 0){
            array[car.row - 1][car.column] = car.color;
            array[car.row + car.length - 1][car.column] = 0;
            car.row--;
            return array;
        }
        else
            return null;
    }
}

var moveCarDownAndLeft = function(car,field){
    let array = deepCopy(field);
    if(car.horizontal){
        if(array[car.row][car.column - 1] === 0){
            array[car.row][car.column - 1] = car.color;
            array[car.row][car.column + car.length - 1] = 0;
            car.column--;
            return array;
        }
        else
            return null;
    }
    else if(!car.horizontal){
        if(array[car.row + car.length][car.column] === 0){
            array[car.row + car.length][car.column] = car.color;
            array[car.row][car.column] = 0;
            car.row++;
            return array;
        }
        else
            return null;
    }
}

module.exports.moveCarUpAndRight = moveCarUpAndRight;
module.exports.moveCarDownAndLeft = moveCarDownAndLeft;
