var newNode = function (data, parent, color, arrow, counter) {
    this.data = data;
    this.parent = parent;
    this.color = color;
    this.arrow = arrow;
    this.counter = counter;
    this.children = [];
}

class Tree {
    constructor() {
        this.root = null;
    }

    addNode(data, parent,color,arrow,counter){
        const node = new newNode(data,parent,color,arrow,counter);
        const parentNode = parent ? this.findBFS(parent) : null;

        if(parentNode){
            parentNode.children.push(node);
        }   
        else if(!this.root){
                this.root = node;    
        }
    }

    findBFS(data) {
        const queue = [this.root];
        let _node = null;
        
        this.traverseBFS((node)=>{
            if(node.data == data)
                _node = node;
        })
        
        return _node;
    }

    traverseBFS(cb) {
        const queue = [this.root];

        if(cb)
            while(queue.length){
                const node = queue.shift();

                cb(node);

                for(const child of node.children)
                    queue.push(child)
            }
    }
}


module.exports.Tree = Tree;
module.exports.newNode = newNode;