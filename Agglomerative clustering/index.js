//-------------------------------------------------------------------------Drawing canvas------------------------------------------------------------------------------
var backgroundColor = "#B0C4DE"
var lineColor = "#CD5C5C"
var fieldColor = "#000000"
var titleColor = "#8A2BE2"
var titleFont = '900 30px Arial'
var statsFont = 'normal 11px Arial';
var centroidColor = "#00FFFF"
var medoidColor = "#00FF7F"
var whiteColor = "#FFFFFF"
var statsColor = "#663399"
var otherDotsColor = "#FFFF00"
var centroidColors = ["#FF0000", "#FFD700", "#FAEBD7", "#00FFFF", "#7FFFD4", "#0000FF", "#7FFF00", "#8A2BE2", "#A52A2A", "#FF7F50", "#B8860B", "#FF00FF", "#006400", "#FF8C00", "#FF4500", "#696969", "#4B0082", "#DDA0DD"]
var medoidColors = ["#FF0000", "#FFD700", "#FAEBD7", "#00FFFF", "#7FFFD4", "#0000FF", "#7FFF00", "#8A2BE2", "#A52A2A", "#FF7F50", "#B8860B", "#FF00FF", "#006400", "#FF8C00", "#FFD700", "#FF4500", "#696969", "#FF0000", "#4B0082", "#DDA0DD"]
var generatingTime = 0
var timerCentroid = 0
var timerMedoid = 0
var realTime = 0


var dotSize = 0.05

var canvas = document.createElement('canvas')
canvas.width = 1520
canvas.height = 693
var ctx = canvas.getContext('2d')
document.body.appendChild(canvas)


var drawBackground = function () {
    let array = ['Centroid algorithm time: ', 'Medoid algorithm time: ', 'Number of centroid clusters: ', 'Number of medoid clusters: ', 'Size of centroid matrix: ', 'Size of medoid matrix: ']
    let array2 = [timerCentroid / 1000 + ' s', timerMedoid / 1000 + ' s', centroidDots.length, medoidDots.length, centroidMatrix.length, medoidMatrix.length]

    ctx.beginPath()
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.stroke()

    ctx.beginPath()
    ctx.strokeStyle = backgroundColor
    ctx.moveTo(canvas.width / 2  + 1, 0)
    ctx.lineTo(canvas.width / 2 + 1, canvas.height)
    ctx.stroke()

    ctx.beginPath()
    ctx.fillStyle = fieldColor
    ctx.fillRect(130 -5, 130-5, 510, 510)
    ctx.fillRect(130-5 + canvas.width / 2, 130-5, 510, 510)
    ctx.stroke()

    ctx.beginPath()
    ctx.fillStyle = titleColor
    ctx.font = titleFont
    ctx.fillText("Stats", 718, 130)
    ctx.stroke()

    for (let i = 1; i < 3; i++) {
        let constant = 80
        if (i != 2) {
            ctx.beginPath()
            ctx.strokeStyle = "#708090"
            ctx.moveTo(670, 220 + constant * i)
            ctx.lineTo(860, 220 + constant * i)
            ctx.stroke()
        }


        ctx.beginPath()
        ctx.fillStyle = statsColor
        ctx.font = statsFont
        ctx.fillText(array.shift() + array2.shift(), 680, 175 + constant * i)
        ctx.fillText(array.shift() + array2.shift(), 680, 190 + constant * i)
        ctx.stroke()
    }

    ctx.beginPath()
    ctx.fillStyle = titleColor
    ctx.font = titleFont
    ctx.fillText("Centroid", canvas.width / 5, 100)
    ctx.fillText("Medoid", canvas.width / 5 + canvas.width / 2 + 20, 100)
    ctx.stroke()
}

var drawDots = function (dots) {
    for (let dot of dots) {
        let c = 1
        let m = 1
        if (dot.isCentroid)
            c = 3
        else
            c = 1
        if (dot.isMedoid)
            m = 3
        else
            m = 1
        ctx.beginPath()
        ctx.fillStyle = dot.color1
        ctx.fillRect(130 + dot.x * dotSize - 3, 130 + dot.y * dotSize - 3, 2 * c, 2 * c)
        ctx.stroke()

        ctx.beginPath()
        ctx.fillStyle = dot.color2
        ctx.fillRect(130 + canvas.width / 2 + dot.x * dotSize - 3, 130 + dot.y * dotSize - 3, 2 * m, 2 * m)
        ctx.stroke()
    }
}


var showRealTime = function () {
    ctx.beginPath()
    ctx.fillStyle = statsColor
    ctx.font = statsFont
    ctx.fillText("Real time: " + realTime / 1000 + ' s', 680, 240)
    ctx.stroke()
}

//------------------------------------------------------------------------Starting dots-------------------------------------------------------------------
const numberOfStartingDots = 15
const numberOfGeneratedDots = 400
const offset = 500
const radius = 1000

var dots = []
var centroidDots = []
var medoidDots = []

var dotNumber = 0

function Dot(id, x, y, color1, color2) {
    this.id = id
    this.x = x
    this.y = y
    this.color1 = color1
    this.color2 = color2

}

function TempDot(id, ids, x, y, color1, color2, isCentroid, isMedoid) {
    this.id = id
    this.ids = ids
    this.x = x
    this.y = y
    this.color1 = color1
    this.color2 = color2
    this.isCentroid = isCentroid
    this.isMedoid = isMedoid
}



for (dotNumber; dotNumber < numberOfStartingDots; dotNumber++) {
    let x = Math.floor(Math.random() * 10000)
    let y = Math.floor(Math.random() * 10000)
    let dot = new Dot(dotNumber, x, y, whiteColor, whiteColor)
    dots.push(dot)
    let tempId = []
    tempId.push(dotNumber)
    let tempDot = new TempDot(dotNumber, tempId, x, y, whiteColor, whiteColor, false, false)
    centroidDots.push(tempDot)
    medoidDots.push(tempDot)
}
//---------------------------------------------------------------------Creating matrices------------------------------------------------------------------------
var centroidMatrix = []
var medoidMatrix = []

var calculateDistance = function (x1, y1, x2, y2) {
    return Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
}

function Element(id, distance, ids) {
    this.id = id
    this.distance = distance
    this.ids = ids
}

let id = 0
for (let i = 0; i < numberOfStartingDots - 1; i++) {
    for (let j = i + 1; j < dotNumber; j++) {
        let distance = calculateDistance(centroidDots[i].x, centroidDots[i].y, dots[j].x, dots[j].y)
        let ids = []
        ids.push(centroidDots[i].ids[0])
        ids.push(centroidDots[j].ids[0])
        let element = new Element(id, distance, ids)
        id++
        centroidMatrix.push(element)
        medoidMatrix.push(element)
    }
}
//------------------------------------------------------------------Generating new dots and adding to centroidM----------------------------------------------------------
var generateNewDot = function () {
    let offsetX = Math.floor(Math.random() * offset) + 1
    let offsetY = Math.floor(Math.random() * offset) + 1
    let randomDot = Math.floor(Math.random() * (dotNumber - 1))

    let signX = offsetX <= offset / 2 ? -offsetX : offsetX - offset / 2
    let signY = offsetY <= offset / 2 ? -offsetY : offsetY - offset / 2

    let tempX = 0
    let tempY = 0

    let tempDot = dots[randomDot]

    if (tempDot.x + signX < 0)
        tempX = tempDot.x - signX
    else if (tempDot.x + signX > 9999)
        tempX = tempDot.x - signX
    else
        tempX = tempDot.x + signX


    if (tempDot.y + signY < 0)
        tempY = tempDot.y - signY
    else if (tempDot.y + signY > 9999)
        tempY = tempDot.y - signY
    else
        tempY = tempDot.y + signY

    let dot = new Dot(dotNumber, tempX, tempY, whiteColor, whiteColor)
    let tempDotNumber = []
    tempDotNumber.push(dotNumber)
    let temporaryDot = new TempDot(dotNumber, tempDotNumber, tempX, tempY, whiteColor, whiteColor, false, false)

    for (let member of centroidDots) {
        let distance = calculateDistance(temporaryDot.x, temporaryDot.y, member.x, member.y)
        let ids = []
        ids.push(member.ids[0])
        ids.push(temporaryDot.ids[0])
        let element = new Element(id, distance, ids)
        id++
        centroidMatrix.push(element)
        medoidMatrix.push(element)
    }

    centroidDots.push(temporaryDot)
    medoidDots.push(temporaryDot)
    dots.push(dot)
    dotNumber++
}

let realTimeStart = Date.now()
var drawingDots = setInterval(() => {
    drawBackground()
    let generatingStart = Date.now()
    generateNewDot()
    let generatingEnd = Date.now()
    generatingTime += generatingEnd - generatingStart
    drawDots(dots)
    if (dotNumber === numberOfGeneratedDots + numberOfStartingDots) {
        clearInterval(drawingDots)
        let stop = false
        var drawingCentroidClusters = setInterval(() => {

            let start = Date.now()
            stop = refactorCentroidMatrix()
            let end = Date.now()
            timerCentroid += end - start

            drawBackground()
            drawDots(dots)
            drawDots(centroidDots)

            if (stop) {
                clearInterval(drawingCentroidClusters)

                let finish = false
                var drawingMedoidClusters = setInterval(() => {

                    let start1 = Date.now()
                    finish = refactorMedoidMatrix()
                    let end1 = Date.now()
                    timerMedoid += end1 - start1


                    drawBackground()
                    drawDots(dots)
                    drawDots(centroidDots)

                    if (finish) {
                        clearInterval(drawingMedoidClusters)
                        let realTimeEnd = Date.now()
                        realTime = realTimeEnd - realTimeStart

                        drawBackground()
                        drawDots(dots)
                        drawDots(centroidDots)
                        showRealTime()
                    }

                })
            }
        })
    }
})



//--------------------------------------------------------------------Working with centroid matrix-------------------------------------------------------------------
var numberofcolors = 0

var refactorCentroidMatrix = function () {
    let minCentroidDistance = Number.MAX_VALUE
    let tempElement = {}
    for (let element of centroidMatrix) {
        if (element.distance < minCentroidDistance) {
            minCentroidDistance = element.distance
            tempElement = element
        }
    }
    if (minCentroidDistance <= radius) {
        let dotsWithMatchingIds = []
        let ids = []
        for (let dot of centroidDots) {
            loop:
            for (let id of tempElement.ids) {
                for (let dotId of dot.ids) {
                    if (dotId === id) {
                        dotsWithMatchingIds.push(dot)
                        for (let item of dot.ids)
                            ids.push(item)
                        break loop
                    }
                }
            }
        }
        let centroid = calculateCentroid(dotsWithMatchingIds)
        reduceCentroidMatrix(ids)
        refactorCentroidDots(ids, centroid)
        refactorElementsInCentroidMatrix(centroid)
        centroidDots.push(centroid)
        return false
    }
    else {
        for (let dot of centroidDots) {
            let color = centroidColors.shift()
            dot.isCentroid = true
            dot.color1 = color
            dot.color2 = fieldColor
            assignCentroidColor(dot.ids, color)
        }
        while (centroidMatrix.length != 0)
            centroidMatrix.shift()
        return true
    }
}

var calculateCentroid = function (array) {
    if (numberofcolors === 16)
        numberofcolors = 0
    let tempX = 0
    let tempY = 0
    let numOfIds = 0
    let newIds = []
    for (let element of array) {
        for (let item of element.ids) {
            newIds.push(item)
            const dot = dots.find(({ id }) => id === item)
            tempX += dot.x
            tempY += dot.y
            numOfIds++
        }
    }
    let newDot = new TempDot(dotNumber, newIds, Math.floor(tempX / numOfIds), Math.floor(tempY / numOfIds), centroidColors[numberofcolors], whiteColor, true, false)
    numberofcolors++
    dotNumber++
    return newDot
}


var refactorCentroidDots = function (array) {
    let indexes = []
    for (let dot of centroidDots) {
        for (let id of dot.ids) {
            for (let item of array) {
                if (id === item) {
                    let tempIndex = centroidDots.findIndex(({ id }) => id === dot.id)
                    indexes.push(tempIndex)
                }
            }
        }
    }
    let tempLength = indexes.length
    let previous = 0
    let current = 0
    let reverseArray = indexes.sort((a, b) => a - b).reverse()
    for (let i = 0; i < tempLength; i++) {
        current = reverseArray.shift()
        if (current !== previous) {
            centroidDots.splice(current, 1)
        }
        previous = current
    }
    return
}


var reduceCentroidMatrix = function (array) {
    let indexes = []
    for (let element of centroidMatrix) {
        for (let id of element.ids) {
            for (let item of array) {
                if (item === id) {
                    let tempIndex = centroidMatrix.findIndex(({ id }) => id === element.id)
                    indexes.push(tempIndex)
                }
            }
        }
    }
    let tempLength = indexes.length
    let previous = 0
    let current = 0
    let reverseArray = indexes.sort((a, b) => a - b).reverse()
    for (let i = 0; i < tempLength; i++) {
        current = reverseArray.shift()
        if (current !== previous) {
            centroidMatrix.splice(current, 1)
        }
        previous = current
    }
    return
}


var refactorElementsInCentroidMatrix = function (object) {
    let count = 0
    for (let dot of centroidDots) {
        count++
        let distance = calculateDistance(dot.x, dot.y, object.x, object.y)
        let tempIds = []
        for (let id of dot.ids)
            tempIds.push(id)
        for (let id of object.ids)
            tempIds.push(id)
        let element = new Element(id, distance, tempIds)
        centroidMatrix.push(element)
        id++
    }
    return
}

var assignCentroidColor = function (array, color) {
    for (let item of array) {
        let tempIndex = dots.findIndex(({ id }) => id === item)
        dots[tempIndex].color1 = color

    }
}

//-------------------------------------------------------------------------Working with medoid matrix----------------------------------------------------------------
var colornumber = 0

var refactorMedoidMatrix = function () {
    let minMedoidDistance = Number.MAX_VALUE
    let tempElement = {}
    for (let element of medoidMatrix) {
        if (element.distance < minMedoidDistance) {
            minMedoidDistance = element.distance
            tempElement = element
        }
    }
    if (minMedoidDistance <= radius) {
        let dotsWithMatchingIds = []
        let ids = []
        for (let dot of medoidDots) {
            loop:
            for (let id of tempElement.ids) {
                for (let dotId of dot.ids) {
                    if (dotId === id) {
                        dotsWithMatchingIds.push(dot)
                        for (let item of dot.ids)
                            ids.push(item)
                        break loop
                    }
                }
            }
        }
        let Medoid = calculateMedoid(dotsWithMatchingIds)
        reduceMedoidMatrix(ids)
        refactorMedoidDots(ids, Medoid)
        refactorElementsInMedoidMatrix(Medoid)
        medoidDots.push(Medoid)
        return false
    }
    else {
        for (let dot of medoidDots) {
            let color = medoidColors.shift()
            dot.isMedoid = true
            dot.color1 = fieldColor
            dot.color2 = color
            assignMedoidColor(dot.ids, color)
            displayMedoid(dot.ids)
        }
        while (medoidMatrix.length != 0)
            medoidMatrix.shift()
        return true
    }
}

var calculateMedoid = function (array) {
    if (colornumber === 16)
        colornumber = 0
    let tempX = 0
    let tempY = 0
    let numOfIds = 0
    let newIds = []
    for (let element of array) {
        for (let item of element.ids) {
            newIds.push(item)
            const dot = dots.find(({ id }) => id === item)
            dot.color2 = medoidColors[numberofcolors]
            tempX += dot.x
            tempY += dot.y
            numOfIds++
        }
    }
    let newDot = new TempDot(dotNumber, newIds, Math.floor((tempX / numOfIds) - 3), Math.floor((tempY / numOfIds) - 3), whiteColor, medoidColors[numberofcolors], true, false)
    numberofcolors++
    dotNumber++
    return newDot
}


var refactorMedoidDots = function (array) {
    let indexes = []
    for (let dot of medoidDots) {
        for (let id of dot.ids) {
            for (let item of array) {
                if (id === item) {
                    let tempIndex = medoidDots.findIndex(({ id }) => id === dot.id)
                    indexes.push(tempIndex)
                }
            }
        }
    }
    let tempLength = indexes.length
    let previous = 0
    let current = 0
    let reverseArray = indexes.sort((a, b) => a - b).reverse()
    for (let i = 0; i < tempLength; i++) {
        current = reverseArray.shift()
        if (current !== previous) {
            medoidDots.splice(current, 1)
        }
        previous = current
    }
    return
}


var displayMedoid = function (array) {
    let bestDist = Number.MAX_VALUE
    let tempDist = 0
    let tempId = 0
    let tempX = 0
    let tempY = 0
    for (let dot of array) {
        let index = dots.findIndex(({ id }) => id === dot)
        tempX = dots[index].x
        tempY = dots[index].y
        for (let item of array) {
            let tempindex = dots.findIndex(({ id }) => id === item)
            tempDist += calculateDistance(tempX, tempY, dots[tempindex].x, dots[tempindex].y)
        }
        if (tempDist < bestDist) {
            tempId = dot
            bestDist = tempDist
        }
        tempDist = 0
        tempX = 0
        tempY = 0
    }
    let medoid = dots.findIndex(({ id }) => id === tempId)
    dots[medoid].isMedoid = true
}


var reduceMedoidMatrix = function (array) {
    let indexes = []
    for (let element of medoidMatrix) {
        for (let id of element.ids) {
            for (let item of array) {
                if (item === id) {
                    let tempIndex = medoidMatrix.findIndex(({ id }) => id === element.id)
                    indexes.push(tempIndex)
                }
            }
        }
    }
    let tempLength = indexes.length
    let previous = 0
    let current = 0
    let reverseArray = indexes.sort((a, b) => a - b).reverse()
    for (let i = 0; i < tempLength; i++) {
        current = reverseArray.shift()
        if (current !== previous) {
            medoidMatrix.splice(current, 1)
        }
        previous = current
    }
    return
}


var refactorElementsInMedoidMatrix = function (object) {
    let count = 0
    for (let dot of medoidDots) {
        count++
        let distance = calculateDistance(dot.x, dot.y, object.x, object.y)
        let tempIds = []
        for (let id of dot.ids)
            tempIds.push(id)
        for (let id of object.ids)
            tempIds.push(id)
        let element = new Element(id, distance, tempIds)
        medoidMatrix.push(element)
        id++
    }
    return
}

var assignMedoidColor = function (array, color) {
    for (let item of array) {
        let tempIndex = dots.findIndex(({ id }) => id === item)
        dots[tempIndex].color2 = color

    }
}
