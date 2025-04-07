const initialGrid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

let currentGrid = JSON.parse(JSON.stringify(initialGrid));

function isValid(grid, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) return false;
    }

    for (let x = 0; x < 9; x++) {
        if (grid[x][col] === num) return false;
    }

    let startRow = row - row % 3;
    let startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] === num) return false;
        }
    }

    return true;
}

function findEmpty(grid) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (grid[i][j] === 0) return [i, j];
        }
    }
    return null;
}

function solveSudoku(grid) {
    let emptySpot = findEmpty(grid);
    if (!emptySpot) return true;

    let [row, col] = emptySpot;

    for (let num = 1; num <= 9; num++) {
        if (isValid(grid, row, col, num)) {
            grid[row][col] = num;

            if (solveSudoku(grid)) return true;

            grid[row][col] = 0;
        }
    }
    return false;
}

function createBoard() {
    const board = document.getElementById('sudoku-board');
    board.innerHTML = '';

    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.min = 1;
            input.max = 9;
            input.value = initialGrid[i][j] || '';
            
            if (initialGrid[i][j] !== 0) {
                input.disabled = true;
                input.classList.add('initial');
            }

            input.addEventListener('input', (e) => {
                let value = parseInt(e.target.value) || 0;
                if (value < 0 || value > 9) {
                    value = 0;
                    e.target.value = '';
                }
                currentGrid[i][j] = value;
                e.target.classList.remove('incorrect');
                
                if (value !== 0) {
                    const tempValue = currentGrid[i][j];
                    currentGrid[i][j] = 0;
                    if (!isValid(currentGrid, i, j, tempValue)) {
                        e.target.classList.add('incorrect');
                    }
                    currentGrid[i][j] = tempValue;
                }
            });

            cell.appendChild(input);
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function checkSolution() {
    const resultElement = document.getElementById('result');
    const inputs = document.querySelectorAll('#sudoku-board input');
    
    inputs.forEach(input => input.classList.remove('incorrect'));
    
    if (findEmpty(currentGrid)) {
        resultElement.textContent = 'O quebra-cabeça não está completo!';
        return;
    }

    let hasError = false;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const temp = currentGrid[i][j];
            currentGrid[i][j] = 0;
            if (!isValid(currentGrid, i, j, temp)) {
                currentGrid[i][j] = temp;
                hasError = true;
                // Mark incorrect cell
                const input = inputs[i * 9 + j];
                if (!input.classList.contains('initial')) {
                    input.classList.add('incorrect');
                }
            }
            currentGrid[i][j] = temp;
        }
    }
    
    resultElement.textContent = hasError ? 'A solução está incorreta!' : 'Parabéns! A solução está correta!';
}

document.addEventListener('DOMContentLoaded', () => {
    createBoard();
    document.getElementById('check-btn').addEventListener('click', checkSolution);
});
