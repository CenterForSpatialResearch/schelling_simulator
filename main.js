'use strict'

// 16x13

const COLUMNS = 16
const ROWS = 13
const RATIO = 0.5

let cells = []
let index = 0

function setup() {
    let canvas = createCanvas(490, 420)
    canvas.parent('p5') 
    strokeWeight(2)
    rect(0, 0, width, height)
    textFont('monospace')
    textSize(25)
    textAlign(LEFT, TOP)
    for (let c=0; c<ROWS * COLUMNS; c++) {
        cells.push(random() > 0.5 ? 1 : 0)
    }
    let blanks = (COLUMNS * ROWS) - int((COLUMNS * ROWS) * .6)
    while (blanks >= 0) {
        let c = int(random(ROWS * COLUMNS))
        if (cells[c] != null) {
            cells[c] = null
            blanks--
        }
    }
    frameRate(10)
}

function draw() {
    background(255)

    text(getCellString(), 10, 10, 490)    
}

function mouseClicked() {
    let checked = 0
    while (true) {
        index++
        index %= ROWS * COLUMNS
        if (checked++ == cells.length) {
            console.log('DONE')
            break
        }
        console.log(index)
        if (!isHappy(index)) {
            let happy = isHappy(index, null, true)
            console.log(happy)
            let new_position = moveAgent(index)    
            console.log('\t\tmoved', index, new_position)      
            happy = isHappy(new_position, null, true)
            console.log(happy)
            if (new_position) {
                break
            }
        }
    }
}

function isHappy(c, value=null, verbose=false) {
    if (value == null) {
        if (cells[c] == null) {
            if (verbose) {
                console.log("\tspace is null")
            }
            return true
        } else {
            value = cells[c]
        }
    }
    let neighbors = getNeighbors(c)
    let total = 0
    let same = 0
    for (let neighbor of neighbors) {
        if (neighbor < 0 || neighbor == null) {
            continue
        }
        if (neighbor == value) {
            same++
        }
        total++
    }
    if (total == 0) {
        return false
    }
    let ratio = same / total
    if (verbose) {
        console.log("\tratio", ratio, same, total)
    }
    return ratio >= RATIO ? true : false
}


function moveAgent(index) {
    let open_cells = []
    for (let c=0; c<cells.length; c++) {
        if (cells[c] == null) {
            if (isHappy(c, cells[index])) {
                open_cells.push(c)
            }
        }
    }
    if (!open_cells.length) {
        return false
    }
    let min_distance = 1000
    let closest = null
    for (let c=0; c<open_cells.length; c++) {
        let distance = manhattanDistance(index, open_cells[c])
        if (distance < min_distance) {
            min_distance = distance
            closest = open_cells[c]            
        }
    }
    cells[closest] = cells[index]
    cells[index] = null
    return closest
}

function manhattanDistance(c1, c2) {
    let row_1 = int(c1 / COLUMNS)
    let column_1 = c1 % COLUMNS
    let row_2 = int(c2 / COLUMNS)
    let column_2 = c2 % COLUMNS
    return abs(row_1 - row_2) + abs(column_1 - column_2)
}

function getCellString() {
    let content = ""
    for (let cell of cells) {
        if (cell == 1) {
            content += '#'
        } else if (cell == 0) {
            content += 'O'
        } else {
            content += ' '
        }
        content += ' '
    }
    return content
}

function getNeighbors(c) {          // cache this
    let neighbors = new Array(8)
    neighbors[0] = cells[c - COLUMNS - 1]
    neighbors[1] = cells[c - COLUMNS] 
    neighbors[2] = cells[c - COLUMNS + 1]
    neighbors[3] = cells[c - 1]
    neighbors[4] = cells[c + 1]
    neighbors[5] = cells[c + COLUMNS - 1]
    neighbors[6] = cells[c + COLUMNS]
    neighbors[7] = cells[c + COLUMNS + 1]
    if (c < COLUMNS) {
        neighbors[0] = -1
        neighbors[1] = -1
        neighbors[2] = -1
    }
    if (c >= cells.length - COLUMNS) {
        neighbors[5] = -1
        neighbors[6] = -1
        neighbors[7] = -1
    }
    if (c % COLUMNS == 0) {
        neighbors[0] = -1
        neighbors[3] = -1
        neighbors[5] = -1
    }
    if (c % COLUMNS == COLUMNS - 1) {
        neighbors[2] = -1
        neighbors[4] = -1
        neighbors[7] = -1
    }    
    return neighbors
}

