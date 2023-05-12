let ORANGE = "orange"
let WHITE = "white"
let BLACK = "black"
let YELLOW = "yellow"
let RED = "red"
let GREEN = "green"

let SPEED = 200

/**
 * Nächste aufgabe wenn ein feld schon bereits grün oder rot ist soll ich es nicht mit schwarz übermalen können!
 */

let RECTWIDTH = 40
let RECTHEIGHT = 40
/**
 * Canvas - all settings for Canvas
 */
class Canvas{
    constructor(rectWidth = 20,rectHeight = 20,dimension = "2d"){
        this.canvas = document.getElementById("canvas")
        this.ctx = this.canvas.getContext(dimension)
        this.rectWidth = rectWidth
        this.rectHeight = rectHeight
        this.stepX = rectWidth
        this.stepY = rectHeight
        this.color = WHITE

        this.start = undefined
        this.target = undefined
        this.walls = []
      
    }
    draw() {
        this.ctx.beginPath()
        for(let x = 0;x <= this.canvas.width; x += this.stepX ){
            this.ctx.moveTo(x,0)
            this.ctx.lineTo(x,this.canvas.height)
        }
        for(let y = 0;y <= this.canvas.height; y += this.stepY ){
            this.ctx.moveTo(0,y)
            this.ctx.lineTo(this.canvas.width,y)
        }
        this.ctx.stroke()
    }
    changeRectangleColor(x,y, color = undefined){
        if(color != undefined){
            this.color = color
        }
        // um die richtigen koordinaten zu kriegen x*= this.rectWitdh
        this.ctx.fillStyle = this.color
        x *= this.rectWidth
        y *= this.rectWidth
        this.ctx.fillRect(x , y ,this.rectWidth,this.rectHeight)
        this.ctx.stroke()
    }
    getCoordinates(event){
        const map = new Map()
        const rect = this.canvas.getBoundingClientRect();
      
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
      
        const rectX = (Math.floor(x / this.rectWidth));
        const rectY = (Math.floor(y / this.rectHeight));
      
        map.set("x",rectX)
        map.set("y",rectY)
        return map
    }

    

    loadImage(x,y, img){
        this.img = new Image();
        this.img.onload = () => {
            x *= this.rectWidth
            y *= this.rectWidth
            // x+ RECTWIDTH / 4 = damit es zentriert wird
            this.ctx.drawImage(this.img, x +(RECTWIDTH / 4), y+ (RECTWIDTH / 4),RECTWIDTH / 2 ,RECTWIDTH / 2)
            this.draw()
        };
        this.img.src = img
    }

    setTarget(x,y){
        this.loadImage(x,y,'img/fire_home.png')
        const map = new Map()
        map.set("x", x)
        map.set("y", y)
        this.target = map
    }

    setStart(x,y){
        this.loadImage(x,y,'img/firetruck.png')
        const map = new Map()
        map.set("x", x)
        map.set("y", y)
        this.start = map
    }

    setWall(x,y){
        if (this.color == BLACK){ 
            const wallCoordinates = { x, y };
            if (!this.walls.some(obj => obj.x === x && obj.y === y)) {
                 this.walls.push(wallCoordinates);
            }
        }
    }

    resetStart(x,y){
        
        if(this.start !== undefined){
            if(this.start.get("x") == x && this.start.get("y") == y){
                this.start = undefined
                return true
            }
        }
        return false
    }
    resetTarget(x,y){
        if(this.target !== undefined){
            if(this.target.get("x") == x && this.target.get("y")== y){
                this.target = undefined
                return true
            }
        }
        return false
    }

    delWallElement(x,y){
       
        if (this.color == WHITE){  
            const wallCoordinates = {x,y}
            const index = this.walls.findIndex(obj => obj.x === wallCoordinates.x && obj.y === wallCoordinates.y);
            if (index !== -1) {
                this.walls.splice(index, 1);
                //console.log(this.walls);
            }
        }
    }

    getWall(){
        return this.walls
    }

    getTarget(){
        return this.target
    }

    getStart(){
        return this.start
    }

    checkFieldBeforeDrawing(x,y){
        let isTargetOrStart = false
        let xValOfStart
        let yValOfTarget 
        let yValOfStart
        let xValOfTarget
        if(this.start != undefined){
            xValOfStart = this.getStart().get("x")
            yValOfStart = this.getStart().get("y")
        }
    
        if(this.target != undefined){
            xValOfTarget = this.getTarget().get("x")
            yValOfTarget = this.getTarget().get("y")
        }
    
        if(x == xValOfStart && y == yValOfStart){
            isTargetOrStart = true
        }
        if(x == xValOfTarget && y == yValOfTarget)
        {
            isTargetOrStart = true 
        }
    
        return isTargetOrStart
    }

    resetCanvas(){
        this.ctx.fillStyle = WHITE;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.color = WHITE
        this.start = undefined
        this.target = undefined
        this.draw()
    }

    setColor(expr){
        switch(expr){
            case 1:
                this.color = RED
                break;
            case 2:
                this.color = BLACK
                break;
            case 3:
                this.color = GREEN
                break;
            case 4:
                this.color = WHITE
        }
    }

}
/**
 * MouseEvents - class to handle events 
 */
class MouseEvents {
    constructor(obj){
        this.isLeftClick = false
        this.isMouseMove = false
        this.isMouseUp = false
        this.isRightClick = false
        this.isMouseDown = false
        this.obj = obj
        
        /**
         * case when mousedown - 
         * if left button clicked then isLeftClick equal true
         * if right button clicked then isRightClick equal true
         * isMouseDown will be direct settet to true
         */
        this.obj.canvas.addEventListener("mousedown", function(e){
            this.isMouseDown = true
            if(e.button === 0){ //loft click
                this.isLeftClick = true
            }
            else if(e.button === 2){ // right click
                this.isRightClick = true    
            }
        }.bind(this))

        this.obj.canvas.addEventListener("mousemove", function(){
            this.isMouseMove = true
        }.bind(this))
        
        this.obj.canvas.addEventListener("mouseup", function(e){
            this.isMouseUp = true
            if(e.button === 0){
                this.isLeftClick = false
            }
            else if(e.button === 2){
                this.isRightClick = false
            }
        }.bind(this))

        this.obj.canvas.addEventListener("contextmenu", function(e){
            e.preventDefault();
            this.isRightClick = true
        }.bind(this))
        
        this.obj.canvas.addEventListener("mousemove", function(e){
            //console.log(this.isMouseMove + " " + this.isLeftClick + " " + this.isMouseDown + " " + !this.isMouseUp)
            if(this.isLeftClick && this.isMouseDown && this.isMouseMove && !this.isMouseUp){
                const map = this.obj.getCoordinates(e)
                const x = map.get("x")
                const y = map.get("y")
                
                this.obj.resetStart(x,y)
                this.obj.resetTarget(x,y)

                if(this.obj.color == BLACK || this.obj.color == WHITE){
                    //console.log(this.obj.checkFieldBeforeDrawing(x,y))
                    this.obj.setWall(x,y)
                    this.obj.delWallElement(x,y)
                    this.obj.changeRectangleColor(x,y)        
                   
                }

            }else if(this.isRightClick && this.isMouseDown && this.isMouseMove && !this.isMouseUp){
                const map = this.obj.getCoordinates(e)
                const x = map.get("x")
                const y = map.get("y")
                
                let color = this.obj.color
                
                this.obj.color = WHITE
                this.obj.setWall(x,y)
                this.obj.delWallElement(x,y)
                this.obj.resetStart(x,y)
                this.obj.resetTarget(x,y)
                this.obj.changeRectangleColor(x,y,WHITE)
                this.obj.color = color
            }else{
                this.isMouseMove = false
                this.isMouseUp = false
                this.isMouseDown = false
            }
            
        }.bind(this))

        this.obj.canvas.addEventListener("click", function (e) {
            
            const map = this.obj.getCoordinates(e)
            const x = map.get("x")
            const y = map.get("y")
            //console.log(`x: ${x}, y: ${y}`)
            this.obj.resetStart(x,y)
            this.obj.resetTarget(x,y)
            //CHECKS IF START AND TARGET IS ALREADY SETTET
            if(this.obj.start == undefined && this.obj.color == GREEN ){
                this.obj.changeRectangleColor(x, y)
                this.obj.setStart(x,y) 
            }
            if(this.obj.target == undefined && this.obj.color == RED){
                this.obj.changeRectangleColor(x, y)
                this.obj.setTarget(x,y)
            }
            if(this.obj.color == BLACK || this.obj.color == WHITE){
                
                this.obj.changeRectangleColor(x, y)
                this.obj.delWallElement(x,y)
                this.obj.setWall(x,y)
            }              
            

        }.bind(this))

        this.obj.canvas.addEventListener("contextmenu", function (e) {
            const map = obj.getCoordinates(e)
            const x = map.get("x")
            const y = map.get("y")
            //console.log(`x: ${x}, y: ${y}`)
            const color = this.obj.color 
            
            //IF DELETE TARGET THE ATTRIBUTE WILL BE SETTET TO UNDEFINED TO GET LATER A NEW START OR TARGET
            this.obj.resetStart(x,y)
            this.obj.resetTarget(x,y)

            this.obj.color = WHITE
            this.obj.delWallElement(x,y)
            this.obj.setWall(x,y)
            this.obj.changeRectangleColor(x, y,WHITE)
            this.obj.color = color
        }.bind(this))

    }
}

class Node{
    constructor(x,y){
        this.x = x
        this.y = y
        this.adjacent = []
    }
}

class Edge{
    constructor(start,end, cost){
        this.start = start
        this.end = end
        this.cost = cost
    }
}

class Graph{
    constructor(start,target){
        this.xAchse = c.canvas.width / RECTWIDTH
        this.yAchse = c.canvas.height / RECTHEIGHT
        this.adjacentMatrix = []
        this.target = target
        this.start = start
        this.createAdjacentMatrix()
        this.visited = []
        this.queue = []
    }
    createAdjacentMatrix(){
        for(let y = 0;y < this.yAchse;y++){
            let row = []
            for(let x = 0;x < this.xAchse;x++){
                let map = new Map()
                let node = new Node(x,y)
                
                let currCoordinates = new Node(x,y)
                
                let cost = this.distanceBetween(currCoordinates,this.target) //path-cost
                let g = 0
                let h = 0 // heuristic
                let f = g + h // total cost of the node
                this.setAdjacent(x,y,node)
                
                map.set("node",node)
                map.set("cost",cost) 
                map.set("h",h)
                map.set("g",g)
                map.set("fScore",f)
                row.push(map)
            }
            this.adjacentMatrix.push(row)
            
        }
        //console.log(this.adjacentMatrix)
    }
    euclideanDistance(node){
        //  distance from between current node and target node
        const xPosition = node.x
        const yPosition = node.y
        const xTarget = this.target.x
        const yTarget = this.target.y
        const dx = xTarget - xPosition
        const dy = yTarget - yPosition
        return Math.sqrt(dx*dx + dy*dy)
    }

    distanceBetween(node, goal){
        const xPosition = node.x
        const yPosition = node.y
        const xTarget = goal.x
        const yTarget = goal.y
        const dx = xTarget - xPosition
        const dy = yTarget - yPosition
        return Math.abs(xTarget - xPosition) + Math.abs( yTarget - yPosition)
    }

    heuristic(node,goal){
        const dx = Math.abs(node.x - goal.x);
        const dy = Math.abs(node.y - goal.y);
        const D = 1; // D = 1 für eine diagonale Bewegung
        const D2 = Math.sqrt(2); // D2 = √2 für eine diagonale Bewegung
        return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
    }

    getNodeWithMap(position){
        return this.getNode(position.get("x"),position.get("y"))
    }
    getNode(x,y){
        return this.adjacentMatrix[y][x].get("node")
    }
    getCost(x,y){
        return this.adjacentMatrix[y][x].get("cost")
    }
    getHeuristic(x,y){
        return this.adjacentMatrix[y][x].get("h")
    }
    setHeuristic(x,y, val){
        this.adjacentMatrix[y][x].set("h",val)
    }
    getfScore(x,y){
        return this.adjacentMatrix[y][x].get("fScore")
    }
    setfScore(x,y, val){
        this.adjacentMatrix[y][x].set("fScore", val)
    }
    getGCost(x,y){
        return this.adjacentMatrix[y][x].get("g")
    }
    setGCost(x,y,val){
        this.adjacentMatrix[y][x].set("g", val)
    }

    getAdjacent(x,y){
        return this.getNode(x,y).adjacent
    }
    setAdjacent(x,y, node){       

        let adjacentNode = node.adjacent
        const rechts = [(x+1),y ]
        // THIS: \ 
        const diagonalUnderRight = [(x+1) , (y+1)]
        const diagonalAboveLeft = [(x-1),(y-1)]
        const links = [(x-1),y]
        // THIS: /
        const diagonalUnderLeft = [(x-1),(y+1)]
        const diagonalAboveRight = [(x+1),(y-1)]
        const oben = [x,(y-1)]
        const unten =[x,(y+1)]       
        adjacentNode.push(oben)
        //adjacentNode.push(diagonalUnderRight)
        //adjacentNode.push(diagonalAboveLeft)
        adjacentNode.push(rechts)
        adjacentNode.push(unten)
        adjacentNode.push(links)
        let val = adjacentNode.filter(val => val[0] >= 0 && val[0] < this.xAchse && val[1] >= 0 && val[1] < this.yAchse)    
        
        let start  = new Node(x,y)

        let edgeList = []
        val.forEach(indexVal => {
            console.log(indexVal)
            let end = new Node(indexVal[0],indexVal[1])   
            let edge = new Edge(start,end, this.euclideanDistance(end,this.target))
            edgeList.push(edge)
        })
        node.adjacent = edgeList
        //console.log(node.adjacent)
    }

    checkWall(node){
        let walls = c.walls
        for(let i = 0;i < walls.length;i++){
            let check = walls[i]
            if(check.x == node.x && check.y == node.y){
                return true
            }
        }
        return false
    }

    async astar(start, target){
        let openList = new PriorityQueue()
        let openListId = []
        let closedList = []
        openList.push(start, 0)
        openListId.push(start.x + "_" + start.y)
        this.setGCost(start.x,start.y, 0)
    
        while(!openList.isEmpty()){
            let current = openList.dePop().node
            this.removeValueFromArray(openListId, current.x + "_" + current.y)
            closedList.push(current.x + "_" + current.y)
            if(!this.isEqual(this.start,current)){
                c.changeRectangleColor(current.x,current.y, "blue")
                await this.sleep(200)
            }
          
            if(this.isEqual(current,target)){
                return []
            }
    
            const adjacent = this.getAdjacent(current.x,current.y)
            for(let i = 0;i < adjacent.length;i++){
                let neighbour = adjacent[i].end
                if(closedList.includes(neighbour.x + "_" + neighbour.y) || this.checkWall(neighbour)){
                    continue
                }
    
                let tentative_gSCore = this.getGCost(current.x, current.y) + this.distanceBetween(current,neighbour)
    
                let tentativeBetter
                if(!openListId.includes(neighbour.x + "_" + neighbour.y)){
                    openList.push(neighbour)
                    openListId.push(neighbour.x + "_"+ neighbour.y)
                    tentativeBetter = true
                }else if(tentative_gSCore < this.getGCost(neighbour.x,neighbour.y)){
                    tentativeBetter = true
                }else {
                    tentativeBetter = false
                }
    
                if(tentativeBetter){
                    this.setGCost(neighbour.x,neighbour.y,tentative_gSCore)
                    this.setHeuristic(neighbour.x,neighbour.y, this.heuristic(neighbour,target))
                    let fcost = (this.getGCost(neighbour.x,neighbour.y) + this.getHeuristic(neighbour.x,neighbour.y))
                    this.setfScore(neighbour.x,neighbour.y,fcost)
                    
                }
            }
    
        }
        return null
    }
    sleep(ms){
        return new Promise(resolve => setTimeout(resolve,ms))
    }

    async printAlgorithm(path,target){
        for (let i = 1; i < path.length; i++) {
            const node = path[i]      
            c.changeRectangleColor(path[i].x, path[i].y, ORANGE)
            c.loadImage(node.x,node.y,"img/firetruck.png")
            if(i-1 != 0){
                c.changeRectangleColor(path[i-1].x, path[i-1].y,ORANGE)
            }
            else{
                c.changeRectangleColor(path[i-1].x, path[i-1].y,GREEN)
            }
    
            await this.sleep(SPEED)
        }
        c.changeRectangleColor(target.x,target.y,RED)
        c.loadImage(target.x,target.y,"img/home.png")
    }
    isEqual(start,target){
        return start.x == target.x && start.y == target.y
    }

    removeValueFromArray(arr, val) {
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i] === val) {
            arr.splice(i, 1);
          }
        }
        return arr;
    }


    

/*
    async astar(start, target){
        let openList = new PriorityQueue()
        let openListId = []
        let closedList = []
        openList.push(start, 0)
        openListId.push(start.x + "_" + start.y)
        this.setGCost(start.x,start.y, 0)
    
        while(!openList.isEmpty()){
            let current = openList.dePop().node
            this.removeValueFromArray(openListId, current.x + "_" + current.y)
            closedList.push(current.x + "_" + current.y)
            c.changeRectangleColor(current.x,current.y, "blue")
            await this.sleep(200)
            if(this.isEqual(current,target)){
                return []
            }
    
            const adjacent = this.getAdjacent(current.x,current.y)
            let ad = new PriorityQueue()
            for(let i = 0;i < adjacent.length;i++){
                let neighbour = adjacent[i].end
                if(closedList.includes(neighbour.x + "_" + neighbour.y)){
                    continue
                }
                if(!this.checkWall(neighbour)){
                    ad.push(neighbour, this.getfScore(neighbour.x,neighbour.y))
                }
                
            }

            let neighbour = ad.dePop().node
                if(!openListId.includes(neighbour.x + "_" + neighbour.y)){

                    openList.push(neighbour)
                    openListId.push(neighbour.x + "_"+ neighbour.y)
                    
                }            
    
        }
        return null
    }*/

  
    async dfs(start, target) {
        if (this.isEqual(start,target)) {
            return [];
        }
        let startId = start.x + "_" + start.y
        this.visited.push(startId);
        const adjacent = this.getAdjacent(start.x, start.y);
        for (let i = 0; i < adjacent.length; i++) {
            let neighbour = adjacent[i].end
            let neighbourId = neighbour.x +"_"+neighbour.y
            if (!this.visited.includes(neighbourId) && !this.checkWall(neighbour)) {
                if(!this.isEqual(neighbour,target)){
                    c.changeRectangleColor(neighbour.x, neighbour.y, "blue")
                    await this.sleep(SPEED)
                }
                let path = await this.dfs(neighbour, target);
                if (path != null) {
                    return [start].concat(path);
                }
            }
        }
        return null;
    }

    async bfs(start,target){
        let startId = start.x + "_" + start.y
        let parents = {}
        let path = []
    
        this.visited.push(startId)
        this.queue.push(start)
       
        while(this.queue.length > 0 ){
            let node = this.queue.shift()
            let adjacent = this.getAdjacent(node.x,node.y)
           
            for(let i = 0; i < adjacent.length;i++){
                let neighbour = adjacent[i].end
                let neighbourId = neighbour.x +"_"+neighbour.y
                if(!this.visited.includes(neighbourId) && !this.checkWall(neighbour)){

                    parents[neighbourId] = node
                    if (this.isEqual(neighbour,target)) {
                        let current = neighbour
                        while (current !== start) {
                            path.unshift(current)
                            current = parents[current.x + "_" + current.y]
                        }
                        path.unshift(start)
                        console.log(path)
                        path.pop()
                        return path;
                    }
                    c.changeRectangleColor(neighbour.x,neighbour.y, "blue")
                    await this.sleep(SPEED)
                    this.visited.push(neighbourId)
                    this.queue.push(neighbour)
                }
            }
            
        }
        
        return null
    }

    async ucs(start, target) {
        console.log("HIE")
        let queue = new PriorityQueue();
        let startId = start.x + "_" + start.y;

        let path = {};
        path[startId] = [start];
      
        queue.push(start, 0);
        this.visited.push(startId);
      
        while (!queue.isEmpty()) {
          let item = queue.dePop();
          let node = item.node;
          let nodeCost = item.priority;
          let adjacent = this.getAdjacent(node.x, node.y);
      
          for (let i = 0; i < adjacent.length; i++) {
            let neighbour = adjacent[i].end;
            let neighbourCost = adjacent[i].cost;
            let neighbourId = neighbour.x + "_" + neighbour.y;
            let nodeId = node.x + "_" + node.y; 
          
            if (this.isEqual(neighbour, target)) {
              
              path[neighbourId] = path[nodeId].concat([neighbour]);
              path[neighbourId].pop()
              return path[neighbourId];
            }
          
            if (!this.visited.includes(neighbourId)  && !this.checkWall(neighbour)) {
              let totalCost = neighbourCost + nodeCost;
              queue.push(neighbour, totalCost);
              this.visited.push(neighbourId);
          
              path[neighbourId] = path[nodeId].concat([neighbour]);
          
              c.changeRectangleColor(neighbour.x, neighbour.y, "blue");
              await this.sleep(SPEED);
            }
          }
        }
    }

}


class PriorityQueue{
    constructor()
    {
        this.items = []
    }
    push(node, priority) {
        let index = 0;
        if (!this.isEmpty()) {
          for (let i = 0; i < this.items.length; i++) {
            if (priority <= this.items[i].priority) {
              index = i + 1;
              break;
            }
          }
        }
        this.items.splice(index, 0, { node, priority });
    }
    
    dePop(){
        if(!this.isEmpty()){
            return this.items.pop()
        }
        return false
    }

    print(){
        console.log(this.items)
    }

    isEmpty(){
        return this.items.length == 0
    }

}

const c = new Canvas(RECTWIDTH, RECTHEIGHT);
c.draw()
var g = undefined
t = new MouseEvents(c)



let options = {
    bfs: false,
    dfs: false,
    ucs: false,
    astar: false
}

function changeOption(bfs,dfs,ucs,astar){
    options.bfs = bfs
    options.dfs = dfs
    options.ucs = ucs
    options.astar = astar
}

document.getElementById("chooseAlgorithm").addEventListener("click", function(e){
    switch(e.target.value){
        case "1":
            changeOption(false,true,false,false)
            break
        case "2":
        
            changeOption(true,false,false,false)
            break
        case "3":
            changeOption(false,false,true,false)
            break
        case "4":
            changeOption(false,false,false,true)
            break
    }
})




document.getElementById("start").addEventListener("click", async function(){
    if(c.getTarget() != undefined && c.getStart() != undefined){

        let targetNode = new Node(c.getTarget().get("x"),c.getTarget().get("y"))
        let startNode = new  Node(c.getStart().get("x"),c.getStart().get("y"))
        g = new Graph(startNode, targetNode)
    
        var path = undefined
        g.adjacentMatrix.forEach(val => console.log(val))
        //Menü
        if(options.bfs){
            
            path = await g.bfs(startNode,targetNode)
            g.printAlgorithm(path,targetNode)
        }
        else if(options.dfs){
        
            path = await g.dfs(startNode,targetNode)
            g.printAlgorithm(path,targetNode)
        }
        else if(options.ucs){
            path = await g.ucs(startNode,targetNode)
            g.printAlgorithm(path,targetNode)
        }else if(options.astar){
    
            path = await g.astar(startNode,targetNode)
            g.printAlgorithm(path,targetNode)
        
        }
    }else{
        console.log("BITTE START UND ZIEL KNOTEN AUSWÄHLEN")
    }

})

