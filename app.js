window.addEventListener('DOMContentLoaded', () => {
    const COLORS = ['lime-cell', 'purple-cell', 'red-cell', 'blue-cell', 'yellow-cell', 'green-cell', 'pink-cell', 'browen-cell', 'orange-cell', 'cyan-cell']
    const ROWS = 5
    const COLS = 5
    let SCORE = 0;
    let TIMER= 0;
    const resetButton = document.getElementById('reset')
    const timerDisplay = document.getElementById('timer')
    const scoreDisplay = document.getElementById('score')

    var lastMarkedCells = [];
    function reset() {
        SCORE = 0;
        TIMER = 0;
        timerDisplay.textContent = 0;
        scoreDisplay.textContent = 0;
    }
    function startTimer() {
        setInterval(() => {
            TIMER++

            timerDisplay.textContent = `${parseInt(TIMER / 60)}:${parseInt(TIMER % 60)}`
        }, 1000);
    }
    init();
    startTimer();
    function init() {
        let board = document.getElementsByClassName('board')[0];
        for (let row = 1; row <= ROWS; row++) {
            for (let col = 1; col <= COLS; col++) {

                //generate the cells
                let cell = document.createElement('div')
                cell.id = `C_${row}_${col}`

                //set click event
                cell.addEventListener('click', () => cellClick(cell))

                //set random style
                let color = COLORS[Math.floor(Math.random() * COLORS.length)]
                
                cell.className = `cell ${color}`;
                //add the cell to the board
                board.appendChild(cell);
            }
        }
        resetButton.addEventListener('click', reset);

    }

    async function cellClick(cell) {
        if (cell.className == 'disabled-cell') return;
        if (lastMarkedCells.indexOf(cell.id) > -1) {
            unmark(cell)
            return;
        }
        markCell(cell)
        if (lastMarkedCells.length == 2)
            await checkIfMatching()
    }
    function markCell(cell) {


        if (lastMarkedCells.length > 1) {
            clearSelection()
        }
        lastMarkedCells.push(cell);

        cell.classList.add('marked-cell')
    }
    function unmark(cell) {
        let index = lastMarkedCells.indexOf(a => a.id == cell.id)
        if (index > -1)
            lastMarkedCells.splice(index, 1)

        cell.classList.remove('marked-cell')
    }
    function clearSelection() {
        lastMarkedCells.forEach((cell) => {
            cell.classList.remove('marked-cell');
        })
        lastMarkedCells = [];
    }
    async function checkIfMatching() {
        replaceMarkedCellsStyle();

        setTimeout(() => {
            checkRightMove(lastMarkedCells[0]);
            checkRightMove(lastMarkedCells[1]);

        }, 100);


    }
    function checkRightMove(cell) {
        let cell_color = cell.classList[1];
        let row = Number(cell.id.split('_')[1]);
        let col = Number(cell.id.split('_')[2]);

        //check row possiblity
        let row_case1 = isSameColorWith(cell_color, row + 1, col) && isSameColorWith(cell_color, row + 2, col)
        let row_case2 = isSameColorWith(cell_color, row - 1, col) && isSameColorWith(cell_color, row - 2, col)
        let row_case3 = isSameColorWith(cell_color, row - 1, col) && isSameColorWith(cell_color, row + 1, col)

        //check column possiblity
        let col_case1 = isSameColorWith(cell_color, row, col + 1) && isSameColorWith(cell_color, row, col + 2)
        let col_case2 = isSameColorWith(cell_color, row, col - 1) && isSameColorWith(cell_color, row, col - 2)
        let col_case3 = isSameColorWith(cell_color, row, col - 1) && isSameColorWith(cell_color, row, col + 1)
        if (row_case1) resetMatchingCellsInColumn(cell_color, col, row, row + 1, row + 2)
        if (row_case2) resetMatchingCellsInColumn(cell_color, col, row, row - 1, row - 2)
        if (row_case3) resetMatchingCellsInColumn(cell_color, col, row, row - 1, row + 1)

        if (col_case1) resetMatchingCellsInRow(cell_color, row, col, col + 1, col + 2)
        if (col_case2) resetMatchingCellsInRow(cell_color, row, col, col - 1, col - 2)
        if (col_case3) resetMatchingCellsInRow(cell_color, row, col, col - 1, col + 1)
        //increment the score
        if (col_case1 || col_case2 || col_case3 || row_case1 || row_case2 || row_case3)
            incrementScore()

    }
    function incrementScore() {

        SCORE++
        scoreDisplay.textContent = SCORE

    }
    function resetMatchingCellsInColumn(color, col, row1, row2, row3) {
        resetCellColor(color, row1, col)
        resetCellColor(color, row2, col)
        resetCellColor(color, row3, col)
    }
    function resetMatchingCellsInRow(color, row, col1, col2, col3) {
        resetCellColor(color, row, col1)
        resetCellColor(color, row, col2)
        resetCellColor(color, row, col3)
    }
    function resetCellColor(color, row, col) {
        let cell1 = document.getElementById(`C_${row}_${col}`)
        debugger;
        cell1.classList.remove(color)
        let new_color = COLORS[Math.floor(Math.random() * COLORS.length)]

        cell1.classList.add(new_color)
    }
    function isSameColorWith(color, row, col) {
        //check if the row and col are in the board range
        if (row > ROWS || row < 1) return false;
        if (col > COLS || col < 1) return false;
        let cell = document.getElementById(`C_${row}_${col}`)
        if (!cell) return
        return cell.classList[1] == color
    }
    async function replaceMarkedCellsStyle() {
        if (lastMarkedCells.length < 1) return
        let tempClasses = lastMarkedCells[0].className;

        removeCellClasses(lastMarkedCells[0])

        lastMarkedCells[1].classList.forEach((className) => {
            lastMarkedCells[0].classList.add(className)
        })
        removeCellClasses(lastMarkedCells[1])

        lastMarkedCells[1].className = tempClasses;
    }
    function removeCellClasses(cell) {
        cell.className = ''
    }


});