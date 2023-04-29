const {checkSolution} = require('./helpers');

var tempArray = [];

var bfs = function(root){
    var kids = root.children;
    for (let kid of kids){
        tempArray.push(kid);
        if(checkSolution(kid.data)){
            return kid;
        }
    }
    if(tempArray && tempArray.length > 0)
        return bfs(tempArray.shift());

}

module.exports.bfs = bfs;