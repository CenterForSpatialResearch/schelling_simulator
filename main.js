'use strict'

// 16x13

const COLUMNS = 16
const ROWS = 13
const RATIO = 0.5

let cells = []
let index = 0

let countup = 0

function setup() {
    let canvas = createCanvas(490, 420)
    canvas.parent('p5') 
    strokeWeight(2)
    rect(0, 0, width, height)
    textFont('Anonymous Pro')
    textSize(28)
    textAlign(LEFT, TOP)
    frameRate(10)
    init()
}

function init() {
    cells = []
    index = 0    
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
}

function draw() {
    background(255)
    text(getCellString(), 10, 10, 490)    
    if (countup > 0) {        
        countup++
        if (countup == 100) {
            countup = 0
            init()
        }
    }
    let checked = 0
    while (true) {
        index++
        index %= ROWS * COLUMNS
        if (checked++ == cells.length) {
            console.log('DONE')
            countup++
            break
        }
        let value = cells[index]
        if (!isHappy(index, value)) {
            if (moveAgent(index)) {
                break
            }
        }
    }
}

function isHappy(index, value, discount=0) {
    let neighbor_values = getNeighborValues(index)
    let total = 0
    let same = 0
    for (let neighbor_value of neighbor_values) {
        if (neighbor_value == null) {
            continue
        }
        if (neighbor_value == value) {
            same++
        }
        total++
    }
    if (total == 0) {
        return false
    }
    same -= discount
    let ratio = same / total
    return ratio >= RATIO ? true : false
}

function moveAgent(index) {
    let open_cells = []
    let value = cells[index]
    for (let c=0; c<cells.length; c++) {
        if (cells[c] == null) {
            let discount = getNeighbors(index).includes(c) == 1 ? 1 : 0
            if (isHappy(c, value, discount)) {
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

function areNeighbors(c1, c2) {
    let row_1 = int(c1 / COLUMNS)
    let column_1 = c1 % COLUMNS
    let row_2 = int(c2 / COLUMNS)
    let column_2 = c2 % COLUMNS

}

function getNeighborValues(c) {          // cache this
    let neighbors = getNeighbors(c)
    let neighbor_values = []
    for (let neighbor of neighbors) {
        if (neighbor != null) {
            neighbor_values.push(cells[neighbor])
        }
    }
    return neighbor_values
}

function getNeighbors(c) {          // cache this
    let neighbors = new Array(8)
    neighbors[0] = c - COLUMNS - 1
    neighbors[1] = c - COLUMNS
    neighbors[2] = c - COLUMNS + 1
    neighbors[3] = c - 1
    neighbors[4] = c + 1
    neighbors[5] = c + COLUMNS - 1
    neighbors[6] = c + COLUMNS
    neighbors[7] = c + COLUMNS + 1
    if (c < COLUMNS) {
        neighbors[0] = null
        neighbors[1] = null
        neighbors[2] = null
    }
    if (c >= cells.length - COLUMNS) {
        neighbors[5] = null
        neighbors[6] = null
        neighbors[7] = null
    }
    if (c % COLUMNS == 0) {
        neighbors[0] = null
        neighbors[3] = null
        neighbors[5] = null
    }
    if (c % COLUMNS == COLUMNS - 1) {
        neighbors[2] = null
        neighbors[4] = null
        neighbors[7] = null
    }    
    return neighbors
}

function getCellString() {
    let content = ""
    for (let cell of cells) {
        if (cell == 1) {
            content += '#'
        } else if (cell == 0) {
            content += 'o'
        } else {
            content += ' '
        }
        content += ' '
    }
    return content
}