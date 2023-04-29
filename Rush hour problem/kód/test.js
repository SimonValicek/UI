const {startingField} = require('./startingBoard');
const {moveCarUpAndRight, moveCarDownAndLeft} = require('./moves');
const {cars} = require('./Cars/cars3');
const {Tree} = require('./nodeSystem');
const {getCarRow,getCarColumn} = require('./coordinates');
const {deepCopy} = require('./copies');
const {checkIfHappened} = require('./helpers');
const {bfs} = require('./breadthFirstSearch');
const {dfs} = require('./depthFirstSearch');
const {printBfs,solutionBfs} = require('./printBfs');
const {printDfs,solutionDfs} = require('./printDfs');

var parent = deepCopy(startingField);
var carObjects = deepCopy(cars);
var tree = new Tree();
var deckHistory = [];
deckHistory.push(parent);
var tempDeck = [];

var createLevel = function (carObjects, parentNode){
    for (let key of carObjects){
      
        key.row = getCarRow(key,parentNode);
        key.column = getCarColumn(key,parentNode);
        
        let upRightRow = getCarRow(key,parentNode);
        let upRightColumn = getCarColumn(key,parentNode);
        
        let upRight = deepCopy(parentNode);
        while(upRight){
            upRight = moveCarUpAndRight(key,upRight);
            if(checkIfHappened(upRight,deckHistory) && upRight){
               
                deckHistory.push(upRight);
                tempDeck.push(upRight);
                if(key.horizontal){
                    tree.addNode(upRight,parentNode,key.color,'→', key.column - upRightColumn);
                }
                else if(!key.horizontal){
                    tree.addNode(upRight,parentNode,key.color,'↑', upRightRow - key.row);
                }
            } 
        }
        key.row = getCarRow(key,parentNode);
        key.column = getCarColumn(key,parentNode);

        let downLeftRow = getCarRow(key,parentNode);
        let downLeftColumn = getCarColumn(key,parentNode);

        let downLeft = deepCopy(parentNode);
        while(downLeft){
            downLeft = moveCarDownAndLeft(key,downLeft);
            if(checkIfHappened(downLeft,deckHistory) && downLeft){
              
                deckHistory.push(downLeft);
                tempDeck.push(downLeft);
                if(key.horizontal){
                    tree.addNode(downLeft,parentNode,key.color,'←', downLeftColumn - key.column);
                }
                else if(!key.horizontal){
                    tree.addNode(downLeft,parentNode,key.color,'↓', key.row - downLeftRow);
                }     
            }
        }

        key.row = getCarRow(key,parentNode);
        key.column = getCarColumn(key,parentNode);
    }
    if(tempDeck && tempDeck.length !== 0){
        return createLevel(carObjects,tempDeck.shift());
        
    }
}


var main = function () {
    console.log('start');
    const start = Date.now();
    tree.addNode(parent,null,null,null,null);
    createLevel(carObjects,parent);
    const end = Date.now();
    const startBfs = Date.now();
    var result = bfs(tree.root);
    const endBfs = Date.now();
    const startDfs = Date.now();
    var result2 = dfs(tree.root);
    const endtDfs = Date.now();
    if(!result && result2){
        return console.log('Úloha žiaľ nemá žiadne riešenie, inak by si s ňou môj algoritmus hravo poradil xD');
    }
    
    console.log(`Čas za ktorý sa vytvorí strom:  ${(end - start)/1000}  s`);
    console.log(`Čas za ktorý sa prehľadá strom pomocou bfs: ${(endBfs - startBfs)} ms`);
    console.log(`Čas za ktorý sa prehľadá strom pomocou dfs: ${(endtDfs - startDfs)} ms`);
    console.log('result of bfs');
    printBfs(tree.root,tree.root,result.data);
    console.log(solutionBfs.reverse());
    console.log('result of dfs');
    printDfs(tree.root,tree.root,result2.data);
    console.log(solutionDfs.reverse());
  
    console.log('end')
};

main();

module.exports.createLevel = createLevel;