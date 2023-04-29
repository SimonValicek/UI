const {checkSolution} = require('./helpers');

var dfs = function(root){
    if(checkSolution(root.data))
        return root;
    for(let i=0;i<root.children.length;i++){
        var result = dfs(root.children[i]);
            if(result != null){
                return result;
            } 
        }
    return null;
}

module.exports.dfs = dfs;