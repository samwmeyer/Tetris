document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const resetBtn = document.querySelector('#reset')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'mediumblue',
        'goldenrod',
        'lime',
        'red',
        'darkviolet',
        'yellow',
        'cyan'

    ]

    // Tetrominoes!
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [0, width, width + 1, width + 2]
    ]

    const l2Tetromino = [
        [0, 1, width + 1, width * 2 + 1],
        [2, width, width + 1, width + 2],
        [1, width + 1, width * 2 + 1, width * 2 + 2],
        [width, width + 1, width + 2, width * 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const z2Tetromino = [
        [1, width, width + 1, width * 2],
        [width, width + 1, width * 2 + 1, width * 2 + 2],
        [1, width, width + 1, width * 2],
        [width, width + 1, width * 2 + 1, width * 2 + 2],
    ]
    
    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width+  2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]
    
    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]
    
    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, l2Tetromino, zTetromino, z2Tetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0


    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

    //Draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    //Undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    //Assign functions to keyCodes
    function control(e) {
        if (e.keyCode === 37 && (timerId)) {
            moveLeft()
        }
        else if (e.keyCode === 38 && (timerId)) {
            rotate()
        }
        else if (e.keyCode === 39 && (timerId)) {
            moveRight()
        }
        else if (e.keyCode === 40 && (timerId)) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    function moveDown() {
        if (!current.some(index => squares[currentPosition + index + width].classList.contains('taken')) && timerId) {
            undraw()
            currentPosition += width
            draw()
        }
        else {
            freeze()
        }
    }

    function freeze() {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //Drop new tetromino
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
    }

    //Move the tetromino left, unless it's at the edge or there is a blockage
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge) { currentPosition -= 1 }
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){ currentPosition += 1 }
        draw()
    }

    //Move the tetromino left, unless it's at the edge or there is a blockage
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        if(!isAtRightEdge) { currentPosition += 1 }
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) { currentPosition -= 1 }
        draw()
    }

    // Fix rotation at the edge
    function isAtRight() {
        return current.some(index => (currentPosition + index + 1) % width === 0)
    }
    function isAtLeft() {
        return current.some(index => (currentPosition + index) % width === 0)
    }

    // Check rotation position
    function checkRotatedPosition(P){
        P = P || currentPosition
        if ((P + 1) % width < 4) {
            if (isAtRight()) {
                currentPosition += 1
                checkRotatedPosition(P)
            }
        }
        else if (P % width > 5) {
            if (isAtLeft()) {
                currentPosition -= 1
                checkRotatedPosition(P)
            }
        }
    }

    //Rotate the tetromino
    function rotate() {
        undraw()
        currentRotation++
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }

    //Show up-next
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 5
    const displayIndex = 0

    //Tetrominos without rotations
    const upNextTetrominoes = [
        [displayWidth + 3, displayWidth * 2 + 1, displayWidth * 2 + 2, displayWidth * 2 + 3], // L
        [displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2, displayWidth * 2 + 3], // L
        [displayWidth + 2, displayWidth + 3, displayWidth * 2 + 1, displayWidth * 2 + 2], // Z
        [displayWidth + 1, displayWidth + 2, displayWidth * 2 + 2, displayWidth * 2 + 3], // Z2
        [displayWidth + 2, displayWidth * 2 + 1, displayWidth * 2 + 2, displayWidth * 2 + 3], // T
        [displayWidth + 1, displayWidth + 2, displayWidth * 2 + 1, displayWidth * 2 + 2], // O
        [2, displayWidth + 2, displayWidth * 2 + 2, displayWidth * 3 + 2] // I
    ] 

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //Make the START/PAUSE button work
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        }
        else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })

    // Make the RESET button work
    resetBtn.addEventListener('click', () => {
        
        var i = 0

        for (i = 0; i < squares.length; i++) {
            setTimeout(function() {
                if (squares[i].classList.contains('taken')) {
                    squares[i].classList.remove('taken')
                    squares[i].classList.remove('tetromino')
                    squares[i].style.backgroundColor = ''
                    squares.splice(i, 1)
                }
            }, 500)
        }

        location.reload()
    })

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            
            if (row.every(index => squares[index].classList.contains('taken'))) {
                
                timerId = false;
                    row.forEach(index => {
                        squares[index].classList.remove('taken')
                        squares[index].classList.remove('tetromino')
                        squares[index].style.backgroundColor = ''
                    })
                    const squaresRemoved = squares.splice(i, width)
                    squares = squaresRemoved.concat(squares)
                    squares.forEach(cell => grid.appendChild(cell))
                
                score += 10 
                scoreDisplay.innerHTML = score
                timerId = true;
            }
            
        }
    }

    // Game Over
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.style.color = 'red'
            scoreDisplay.innerHTML = 'GAME OVER'
            clearInterval(timerId)
            timerId = false
        }
    }
})

