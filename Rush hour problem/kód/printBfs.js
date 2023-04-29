var kidsBfs = [];
var solutionBfs = [];


var printBfs = function (mainroot,root,resultArray){
    var kids = root.children;

    for(let kid of kids){
        if(!kid.parent){
      
            return;
        }
        kidsBfs.push(kid);
        
        if(compare(kid.data,resultArray)){
            while(kidsBfs.length>0) {
                kidsBfs.shift();
            }
        
            solutionBfs.push([kid.color,kid.arrow,kid.counter]);
            //console.log(kid.data);
            return printBfs(mainroot,mainroot,kid.parent);
        }
    }
if(kidsBfs && kidsBfs.length>0){
    
    return printBfs(mainroot,kidsBfs.shift(),resultArray);
    }
}


var compare = function (array1, array2){
       return (JSON.stringify(array1) == JSON.stringify(array2));
    }
    
module.exports.printBfs = printBfs;
module.exports.solutionBfs = solutionBfs;