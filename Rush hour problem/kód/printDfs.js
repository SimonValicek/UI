var kidsDfs = [];
var solutionDfs = [];


var printDfs = function (mainroot,root,resultArray){
    var kids = root.children;

    for(let kid of kids){
        if(!kid.parent){
      
            return;
        }
        kidsDfs.push(kid);
        
        if(compare(kid.data,resultArray)){
            while(kidsDfs.length>0) {
                kidsDfs.shift();
            }
        
            solutionDfs.push([kid.color,kid.arrow,kid.counter]);
            //console.log(kid.data);
            return printDfs(mainroot,mainroot,kid.parent);
        }
    }
if(kidsDfs && kidsDfs.length>0){
    
    return printDfs(mainroot,kidsDfs.shift(),resultArray);
    }
}


var compare = function (array1, array2){
       return (JSON.stringify(array1) == JSON.stringify(array2));
    }
    
module.exports.printDfs = printDfs;
module.exports.solutionDfs = solutionDfs;