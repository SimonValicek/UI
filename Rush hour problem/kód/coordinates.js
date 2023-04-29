var getCarRow = function (car,array){
    if(!Array.isArray(array))
        return null;
    for(let i=0;i<8;i++)
        for(let j=0;j<8;j++)
            if(array[i][j]===car.color)  
                return i;
    }
    
    var getCarColumn = function (car,array){
    if(!Array.isArray(array))
        return null;
    for(let i=0;i<8;i++)
        for(let j=0;j<8;j++)
            if(array[i][j]===car.color)
                return j;
}


module.exports.getCarRow = getCarRow;
module.exports.getCarColumn = getCarColumn;
