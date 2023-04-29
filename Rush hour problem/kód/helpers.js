const {startingField} = require('./startingBoard');

var findExitX = function (array){
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(array[i][j]===-1)
                return i;
        }
    }
}

var findExitY = function (array){
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(array[i][j]===-1)
                return j;
        }
    }
}

var exitX = findExitX(startingField);
var exitY = findExitY(startingField) - 1;



var checkSolution = function (array){
    if(array[exitX][exitY]==='red'){
        return true;
    }
    else
        return false;
}

var checkIfHappened = function (board,array){
    let i = 0;
    for(let key of array)
        if(JSON.stringify(board) == JSON.stringify(key))
            i++;
    if(i !== 0)
        return false;
    else 
        return true;
}


module.exports.checkSolution = checkSolution;
module.exports.checkIfHappened = checkIfHappened;
module.exports.exitX = exitX;
module.exports.exitY = exitY; 