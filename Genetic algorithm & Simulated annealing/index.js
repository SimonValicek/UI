//_________________________________________________________________________________________________________________________________________________
//CANVAS (a,c) - vytvorím si canvas v browseri, do ktorého budem vykreslovať

var pix = 2
var rectSize = 10
var border = 14
var borderDisplay = 20
var lineColor = "#8B0000"
var background1 = "#FFEFD5"
var background2 = "#FFDAB9"
var roadLines1 = "#8B0000"
var roadLines2 = "#000080"
var blackColor = "#000000"

var canvas = document.createElement('canvas')
canvas.width = (200*(pix+1.1))+900
canvas.height = (200*(pix+1.35))+20
var ctx = canvas.getContext('2d')
document.body.appendChild(canvas)



//__________________________________________________________________________________________________________________________________________________
//CITIES.JS (a,c)

const number_of_cities = 20
const generation_temp = 5
const sizeOfGeneration = number_of_cities*generation_temp

//Cities.js (a)
const crossover_number = Math.round(sizeOfGeneration*0.64)
const mutation_number = Math.round(sizeOfGeneration*0.28)
const generating_number = sizeOfGeneration - crossover_number - mutation_number


let cities = []

function City(id, x, y){
    this.id = id
    this.x = x,
    this.y = y
}

for (let i=1; i<=number_of_cities; i++){
    let city = new City(i, Math.floor(Math.random() * 201), Math.floor(Math.random() * 201))
    cities.push(city)
}

//_________________________________________________________________________________________________________________________________________________
//GENERATING.JS (a,c)

var generate = function(){
    let array = []
    let aux = []
    while (true){
        let temp = Math.floor(Math.random() * number_of_cities)
        let j = 0
        for (let key of aux){
            if (key==temp)
                j++
        }       
        if (j==0){
            aux.push(temp)
            array.push(cities[temp])
        }
        if (array.length == number_of_cities){
            break
        }    
    }
    return array
}

//Generating.js (a)

let parents = []

var getZeroGeneration = function(){
    for (let i=0; i<sizeOfGeneration; i++){
        let parent = generate()
        parents.push(parent)
    }
}

var getChildrenByGenerating = function(iteration){
    let generatedChildren = []
    for (let i=0; i<iteration;i++)
        generatedChildren.push(generate())
    return generatedChildren 
}

getZeroGeneration()

//Generating.js (c)
let simulatedAnnealingPopulation = generate()


//_________________________________________________________________________________________________________________________________________________
//CALCULATIONS.JS (a,c)

var fullDistance = function(array){
    let distance = 0
    for (let i=0;i<array.length;i++){
        if (i==array.length-1){
            distance += calculateDistance(array[0].x,array[0].y,array[array.length-1].x,array[array.length-1].y)
        }
        else{
            distance += calculateDistance(array[i].x,array[i].y,array[i+1].x,array[i+1].y)
        }
    }
    return distance
}


var calculateDistance = function(x1,y1,x2,y2){
   return Math.round(Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)))
}

//Calculations.js (a)
var willMutate = function(probability_of_mutation){
    let probability = Math.floor(Math.random() *101)+1
    if(probability_of_mutation*100>=probability)
        return true
    else
        return false
}

//Calculation.js (c)
var countProbability = function(l0, l1, tmp){
    let probability = Math.exp((l0-l1)/tmp)
    console.log(probability*100)
    let random = Math.floor(Math.random()*100)+1
    if (random<=probability*100)
        return true
    else if (random>probability*100)
        return false
    else{
        return false 
    }
}


//____________________________________________________________________________________________________________________________________________________
//CROSSOVER.JS (a)

var crossover = function(array){
    let index = Math.floor(Math.random() * number_of_cities)
    let length = Math.floor(Math.random() * (number_of_cities - (index+1)))+1
    let parent_num = Math.floor(Math.random()*array.length)
    let parent_num2 = Math.floor(Math.random()*array.length)

    while(parent_num===parent_num2){
        parent_num2 = Math.floor(Math.random()*array.length)
    }

    let aux = []
    let post_aux = []
    let pre_aux = []
    let final = []

    for (let i=index; i<index+length; i++){
        aux.push(array[parent_num][i])
    }

    for (let i=index+length; i<number_of_cities; i++){
        let j = 0
        for (let key of aux){
            if (key.id === array[parent_num2][i].id){
                j++
            }
        }
        if (j===0) {
        post_aux.push(array[parent_num2][i])
        }
    }

    for (let i=0;i<index+length;i++){
        let j = 0
        for (let key of aux){
            if (key.id === array[parent_num2][i].id){
                j++
            }
        }
        if (j===0) {
        pre_aux.push(array[parent_num2][i])
        }
    }

    index_calculation = number_of_cities-(index+length+post_aux.length)

    for (let i=index_calculation;i<pre_aux.length;i++)
        final.push(pre_aux[i])
    for (let i=0;i<aux.length;i++)
        final.push(aux[i])
    for (let i=0;i<post_aux.length;i++)
        final.push(post_aux[i])   
    for (let i=0;i<index_calculation;i++)
        final.push(pre_aux[i])

    return final
}

var getChildrenByCrossover = function(array, iteration){
    let crossoveredCities = []
    for (let i=0; i<iteration; i++)
        crossoveredCities.push(crossover(array))
    return crossoveredCities
}

//__________________________________________________________________________________________________________________________________________________
//MUTATION.JS

//Mutation.js (a)
var mutate = function(array){
    let final = []
    let mutatedPairs = []
    let parent_num = Math.floor(Math.random()*array.length)

    for (let i=0; i<number_of_cities; i++){
        final.push(array[parent_num][i])
        if(willMutate(1/fullDistance(array[parent_num])*100)){
            let index = Math.floor(Math.random()*number_of_cities)
            if (i===index)
                continue
            mutatedPairs.push([i,index])
            }
        }
    
    while (mutatedPairs.length!==0){
        let temp = mutatedPairs.shift()
        let swap1 = final[temp[0]]
        let swap2 = final[temp[1]]
        final.splice(temp[0],1,swap2)
        final.splice(temp[1],1,swap1)
    }
    
    return final
}

var getChildrenByMutation = function(array, iteration){
    let mutatedCities = []
    for (let i=0; i<iteration; i++){
        mutatedCities.push(mutate(array))
    }
    return mutatedCities
}
      
//Mutation.js (c)
var mutateSimulatedAnnealing = function(array){
    let index = Math.floor(Math.random()*number_of_cities)
    let side = Math.floor(Math.random()*2)
    let up = array[index+1]
    let current = array[index]
    let down = array[index-1]
    let newArray = []
    let first = array[0]
    let last = array[array.length-1]

    for (let key of array)
        newArray.push(key)

    if (side===0){
        if (index===0){
            newArray.splice(index,1,last)
            newArray.splice(array.length-1,1,first)
        }
        else{
            newArray.splice(index,1,down)
            newArray.splice(index-1,1,current)
        }
    }
    else if (side===1){
        if (index===array.length-1){
            newArray.splice(0,1,last)
            newArray.splice(index,1,first)
        }
        else{
            newArray.splice(index,1,up)
            newArray.splice(index+1,1,current)
        }
    }

    return newArray
}


var mutateNeighbours = function(array,index){
    let up = array[index+1]
    let current = array[index]
    let first = array[0]
    let last = array[array.length-1]
    let newArray = []

    for (let key of array)
        newArray.push(key)

    if(index!==number_of_cities-1){
        newArray.splice(index,1,up)
        newArray.splice(index+1,1,current)
    }
    else{
        newArray.splice(0,1,last)
        newArray.splice(index,1,first)
    }

    return newArray
}

var mutateUpsideDown = function(array){
    let everybody = []
    for (let i=0;i<array.length;i++){
        everybody.push(mutateNeighbours(array,i))
    }
    return everybody
}


//______________________________________________________________________________________________________________________________________________________
//CANVAS_2

var displayGeneration = function(){
    ctx.beginPath()
    ctx.font ='normal 9px Arial';
    ctx.fillStyle = lineColor
    ctx.fillText("Počet miest: " + number_of_cities, canvas.width/2 -105, 20+borderDisplay);
    ctx.fillText("Generácia: " + sizeOfGeneration + ' prvkov', canvas.width/2 -105, 35+borderDisplay);
    ctx.fillText("Počet generácii: " + generationNumber, canvas.width/2 -105, 50+borderDisplay);
    ctx.fillText("Počet prvkov: " + generationNumber*sizeOfGeneration, canvas.width/2 -105, 65+borderDisplay);
    ctx.fillText(`Čas: ${(end1 - start1)/1000} s`, canvas.width/2 -105, 80+borderDisplay);
  
    ctx.fillText("Počet miest: " + number_of_cities, canvas.width/2+20, 20+borderDisplay);
    //ctx.fillText("Generácia: " + Math.floor((wholePopulation*number_of_cities)/iteration) + " prvkov", canvas.width/2+20, 35+borderDisplay);
    //ctx.fillText("Generácia vyhovujúcich: " + Math.floor(populationNumber/iteration) + " prvkov", canvas.width/2+20, 50+borderDisplay);
    ctx.fillText("Počet iterácii: " + iteration, canvas.width/2+20, 65+borderDisplay);
    ctx.fillText("Celkový počet prvkov: " + wholePopulation*number_of_cities, canvas.width/2+20, 35+borderDisplay);
    ctx.fillText("Počet vyhovujúcich prvkov: " + populationNumber, canvas.width/2+20, 50+borderDisplay);
    ctx.fillText(`Čas: ${(end2 - start2)/1000} s`, canvas.width/2 +20, 80+borderDisplay);
    ctx.stroke()
}

var drawCanvasBackground = function(){
    ctx.beginPath()
    ctx.fillStyle =  background1
    ctx.fillRect(0, 0, canvas.width,canvas.height);
    ctx.fillStyle = background2
    ctx.fillRect(canvas.width/2+0.5,0,canvas.width,canvas.height)
    let x = canvas.width/2
    ctx.strokeStyle = "#A52A2A"
    ctx.lineWidth = 1
    ctx.moveTo(x,0)
    ctx.lineTo(x,canvas.height/4)
    ctx.lineTo(canvas.width/2-250,canvas.height/4)
    ctx.lineTo(canvas.width/2-250,canvas.height-canvas.height/4)
    ctx.moveTo(x,canvas.height/4)
    ctx.lineTo(canvas.width/2+250,canvas.height/4)
    ctx.lineTo(canvas.width/2+250,canvas.height-canvas.height/4)
    ctx.lineTo(canvas.width/2-250,canvas.height-canvas.height/4)
    ctx.moveTo(canvas.width/2,canvas.height-canvas.height/4)
    ctx.lineTo(canvas.width/2,canvas.height)
    ctx.stroke()
}

var drawGraph = function(array1, array2){
    ctx.beginPath()
    ctx.fillStyle =background2
    ctx.fillRect(canvas.width/2-249.5,canvas.height/4+0.6,249.5,canvas.height/2-0.5)
    ctx.stroke()
   
    ctx.beginPath()
    ctx.fillStyle = background1
    ctx.fillRect(canvas.width/2,canvas.height/4+0.6,249.5,canvas.height/2-0.5)
    ctx.stroke()

    ctx.fillStyle=lineColor
    ctx.font = "small-caps 20px Arial"
    ctx.fillText("Graf", canvas.width/2-27, canvas.height-canvas.height/4-310);
    ctx.strokeStyle = "#000000"
    ctx.moveTo(canvas.width/2-220, canvas.height/4+40)
    ctx.lineTo(canvas.width/2-220, canvas.height-canvas.height/4-30)
    ctx.lineTo(canvas.width/2+220,canvas.height-canvas.height/4-30)
    ctx.fillStyle="#000000"
    ctx.font = "small-caps 10px Arial"
    ctx.fillText('generácie++', canvas.width/2+150, canvas.height-canvas.height/4-20)
    ctx.fillText('teplota --', canvas.width/2+150, canvas.height-canvas.height/4-10)
    let j = 0
    let count = 100
    let iteration = 28
    for (let i=0;i<iteration;i++){
        if(i!==0){
        ctx.moveTo(canvas.width/2-225, canvas.height-canvas.height/4-30-j)
        ctx.lineTo(canvas.width/2-218,canvas.height-canvas.height/4-30-j)
        }
        ctx.font = "small-caps 8px Arial"
        if(i===iteration-1)
            continue
        ctx.fillText(count, canvas.width/2-245,canvas.height-canvas.height/4-38-j)
        count+=100
        j+=10
    }
    ctx.moveTo(canvas.width/2-220, canvas.height-canvas.height/4-40)
    ctx.stroke()
    ctx.beginPath()
 
    ctx.strokeStyle = roadLines1
    for(let i=0;i<array1.length;i++){
        if(i===0){
            ctx.moveTo(canvas.width/2-220+(440/array1.length)*i, canvas.height-canvas.height/4-40-array1[i]/10 )
            continue
        }
        ctx.lineTo(canvas.width/2-220+(440/array1.length)*i, canvas.height-canvas.height/4-40-array1[i]/10 )
    }
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(canvas.width/2-220, canvas.height-canvas.height/4-40)
    ctx.strokeStyle = roadLines2
    for(let i=0;i<array2.length;i++){
        if(i===0){
            ctx.moveTo(canvas.width/2-220+(440/array2.length)*i, canvas.height-canvas.height/4-40-array2[i]/10 )
            continue
        }
        ctx.lineTo(canvas.width/2-220+(440/array2.length)*i, canvas.height-canvas.height/4-40-array2[i]/10 )
    }
    ctx.stroke()
    
    ctx.beginPath()
    ctx.fillStyle = roadLines1
    ctx.fillRect(canvas.width/2-150,canvas.height-canvas.height/4+10,25,10)
    ctx.fillStyle = blackColor
    ctx.font='bold 10px Arial';
    ctx.fillText("-genetický algoritmus", canvas.width/2-120, canvas.height-canvas.height/4+18);
    ctx.stroke

    ctx.beginPath()
    ctx.fillStyle = roadLines2
    ctx.fillRect(canvas.width/2+20,canvas.height-canvas.height/4+10,25,10)
    ctx.fillStyle = blackColor
    ctx.font='bold 10px Arial';
    ctx.fillText("-simulované žíhanie", canvas.width/2+50, canvas.height-canvas.height/4+18);
    ctx.stroke()
}


var drawTitle = function(){
    ctx.beginPath()
    ctx.fillStyle=lineColor
    ctx.font='900 30px Arial';
    ctx.fillText("Genetický algoritmus", canvas.width/15, 50);
    ctx.fillText("Simulované žíhanie", canvas.width/2+(canvas.width/15)*3, 50);

}

var drawInCanvas = function(array1, array2, index, graph1, graph2){
    drawCanvasBackground()
    drawGraph(graph1,graph2)
    drawTitle()
    let startingCoordinates = []
    startingCoordinates.push(array1[0].x,array1[0].y)
    ctx.beginPath()
    let coordinates = []
    for (let city of array1){
        ctx.strokeStyle = "#D2691E"
        ctx.lineWidth = 1
        ctx.moveTo(city.x*pix+rectSize/2+index,city.y*pix+rectSize/2+(index*border)/2)
        ctx.fillStyle = lineColor
        ctx.fillRect(city.x*pix+index,city.y*pix+(index*border)/2,rectSize,rectSize)
        ctx.lineTo(coordinates.shift()*pix+rectSize/2+index,coordinates.shift()*pix+rectSize/2+(index*border)/2)
        coordinates.push(city.x)
        coordinates.push(city.y)
    }
    ctx.moveTo(startingCoordinates.shift()*pix+rectSize/2+index,startingCoordinates.shift()*pix+rectSize/2+(index*border)/2)
    ctx.lineTo(coordinates.shift()*pix+rectSize/2+index,coordinates.shift()*pix+rectSize/2+(index*border)/2)
    ctx.font ='normal 9px Arial';
    ctx.fillStyle = lineColor
    ctx.fillText("Vzdialenosť: " + fullDistance(array1), canvas.width/2+index -125, 5+borderDisplay);
    ctx.stroke()

    ctx.beginPath()
    let startingCoordinatesSA = []
    startingCoordinatesSA.push(array2[0].x,array2[0].y)
    let coordinatesSA = []
    for (let city of array2){
        ctx.strokeStyle = "#E9967A"
        ctx.lineWidth = 1
        ctx.moveTo(1060+city.x*pix+rectSize/2+index,city.y*pix+rectSize/2+(index*border)/2)
        ctx.fillStyle = lineColor
        ctx.fillRect(1060+city.x*pix+index,city.y*pix+(index*border)/2,rectSize,rectSize)
        ctx.lineTo(coordinatesSA.shift()*pix+rectSize/2+index+1060,coordinatesSA.shift()*pix+rectSize/2+(index*border)/2)
        coordinatesSA.push(city.x)
        coordinatesSA.push(city.y)
    }
    ctx.moveTo(startingCoordinatesSA.shift()*pix+rectSize/2+index+1060,startingCoordinatesSA.shift()*pix+rectSize/2+(index*border)/2)
    ctx.lineTo(coordinatesSA.shift()*pix+rectSize/2+index+1060,coordinatesSA.shift()*pix+rectSize/2+(index*border)/2)
    ctx.fillText("Vzdialenosť: " + fullDistance(array2), canvas.width/2+index, 5+borderDisplay);
    ctx.stroke()
}

//________________________________________________________________________________________________________________________________________________-
//SURVIVAL_OF_THE_FITTEST.JS


//SurvivalOfTheFittest.js (a)
let attemps = 0
let generationNumber = 0
let check = 0


let graph = []
let temp = []


while (parents.length!==0)
    temp.push(parents.shift())

let starterCounter = 10000
let starter = 0
for (let i=0;i<temp.length;i++){
    if(fullDistance(temp[i])<=starterCounter){
        starterCounter = fullDistance(temp[i])
        starter = temp[i]
    }
}

var findFittest = function(array, iteration){
    let survivals = []
    for(let i=0;i<iteration;i++){
        let minCityLength=1000000
        let minCity=0
        let index=0
        for(let j=0;j<array.length;j++){
            if(fullDistance(array[j])<=minCityLength){
                minCityLength = fullDistance(array[j])
                minCity = array[j]
                index=j
            }
        }
        array.splice(index,1)
        survivals.push(minCity)
    }
    return survivals
}

var survivalOfTheFittest = function(){
    let all = []

    let crossoveredChildren = getChildrenByCrossover(temp,crossover_number)  
    let mutatedChildren = getChildrenByMutation(temp,mutation_number)
    let survivals = findFittest(temp,generating_number)
    
    for (let key of crossoveredChildren){
         all.push(key)
     }
    for (let key of mutatedChildren){
        all.push(key)
    }
    for (let key of survivals){
        all.push(key)
    }
    while(temp.length!==0)
         temp.shift()

    return all
}

var startHungerGames = function(){
    generationNumber++
    let newArray = survivalOfTheFittest()
    
    for (let key of newArray)
        temp.push(key)

    let champion = findFittest(newArray, 2)
    graph.push(fullDistance(champion[0]))
   

    while(newArray.length!==0)
        newArray.shift()

    if (fullDistance(champion[0])===check){  
        attemps++
    }
    if (attemps === 500){
        generationNumber--
        // console.log('attemps ', attemps)
        // for (let key of temp)
        //     console.log(fullDistance(key))
        return champion[0]
    }

    check = fullDistance(champion[0])
    return startHungerGames()
}

let start1 = Date.now()
let solution = startHungerGames()
let end1 = Date.now()



//____________________________
//SurvivalOfTheFittest.js (c)
let temperature = 50
let fittest = starter
let bin = []
let currentGeneration = []

//výpis
let iteration = 0
let populationNumber = 0
let wholePopulation = 0


currentGeneration.push(starter)

var survivalOfTheFittestSA = function(){
    if (temperature<=0)
        return 

    if (iteration%5===0 && iteration!==0)
        temperature=temperature-15
        
    wholePopulation+=currentGeneration.length
    let newGeneration = []

    for (let key of currentGeneration){
        let newCells = mutateUpsideDown(key)
        for (let newCell of newCells){
            if(fullDistance(newCell)<fullDistance(fittest)){
                newGeneration.push(newCell)
                fittest = newCell
            }
            else if(countProbability(fullDistance(fittest),fullDistance(newCell),temperature)){
                newGeneration.push(newCell)
            }
        } 
    }

    populationNumber += currentGeneration.length
    iteration++

    while(currentGeneration.length!==0)
        bin.push(currentGeneration.shift())
    
    while(newGeneration.length!==0)
        currentGeneration.push(newGeneration.shift())

    return survivalOfTheFittestSA()
}

let start2 = Date.now()
survivalOfTheFittestSA()
let end2 = Date.now()

let graph2 = []
for (let key of bin)
    graph2.push(fullDistance(key))


drawInCanvas(solution, fittest, 20, graph, graph2)
displayGeneration()
console.log(starter)