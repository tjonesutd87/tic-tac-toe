function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    const winningSpaces = [];
    
    //  push cells/spaces in the board array for each space on the gameboard by iterating through rows and columns.
    for (let i = 0; i < rows; i++){
        board[i] = [];
        for (let j = 0; j < columns; j++){
            board[i].push(cell());
        }
    }

    //  the code section below creates an array of winning spaces combos to check the currently filled game
    //  spaces against the XXX or OOO combo 
    const setWinningSpaces = () => {
    
        //  create the rows
        for (i = 0; i < 3; i++){
            winningSpaces[i] = [];
            for (j = 0; j < 3; j++) {
                winningSpaces[i].push(board[i][j].getValue());
            }
            winningSpaces[i] = winningSpaces[i].join('');
            console.log(winningSpaces[i]);
        }

        //  create columns
        for (i = 3; i < 5; i++){
            winningSpaces[i] = [];
            for (j = 0; j < 3; j++){
                winningSpaces[i].push(board[j][i-2].getValue());
            }
            winningSpaces[i] = winningSpaces[i].join('');
        }
        //  create diagonals
        let x = 5;
        winningSpaces[x] = [];
        for(j = 0; j < 3; j++){
            winningSpaces[x].push(board[j][j].getValue());
        }
        winningSpaces[x] = winningSpaces[x].join('');
        x++;
        winningSpaces[x] = [];
        let diagRow = 0;
        for(j = 2; j >= 0; j--){
            winningSpaces[x].push(board[diagRow][j].getValue());
            diagRow++;
        }
        winningSpaces[x] = winningSpaces[x].join('');
    };
    
    const getWinningSpaces = () => winningSpaces;

    //  closure function for drawing the gameboard to the console by retreiving the values of the cells with the cell object's getValue function
    const printBoard = () => {
        const cellContainer = document.getElementById('cell-container');
        for (row in board) {
            for(cell in board[row]){
                const cellValue = document.createElement('button');
                const cellId = row + ',' + cell;
                cellValue.textContent = board[row][cell].getValue();
                cellValue.setAttribute('id', cellId)
                if(cellValue.textContent == 'X') {
                    cellValue.setAttribute('class', 'blue cell');
                } else if(cellValue.textContent == 'O') {
                    cellValue.setAttribute('class', 'red cell');
                } else {
                    cellValue.setAttribute('class', 'empty cell');
                }
                cellContainer.appendChild(cellValue);
            }
        }
    };


    //  closure for getting the game board
    const getBoard = () => board;

    const eraseBoard  = () => {
        for (row in board) {
            for(cell in board[row]){
                const id = row + ',' + cell;
                const cellValue = document.getElementById(id);
                cellValue.remove();
            }
        }
    };
    const resetValues = () => {
        eraseBoard();
        board.map((row) => row.map((cell) => cell.setValue('')));
        printBoard();
    }

    function getSymbol(row, col) {
        return board[row][col].getValue();
    }

    const addSymbol = (row, col, symbol) => board[row][col].setValue(symbol);

    //  Create the cell object that houses the getValue and addSymbol for getting and assigning values to the cells
    function cell() {
        let value = '';

        const setValue = (symbol) => value = symbol;
    
        function getValue() {
            return value;
        }

        return {
            setValue,
            getValue
        };
    }

    return {
        getBoard,
        printBoard,
        eraseBoard,
        resetValues,
        getSymbol,
        addSymbol,
        getWinningSpaces,
        setWinningSpaces,
    };
}

function createPlayer(name, symbol) {
    let playerName = name;
    let playerSymbol = symbol;

    //  getter and setter for player name
    const getPlayerName = () => playerName;
    const getPlayerSymbol = () => playerSymbol;
    const setPlayerName = (newName) => playerName = newName;

    return {
        getPlayerName,
        getPlayerSymbol,
        setPlayerName
    };
}

function gameController(){
    const player1 = createPlayer('Player 1', 'X');
    const player2 = createPlayer('Player 2', 'O');
    const board = gameBoard();
    let currentPlayer = player1;
    let gameWin = false;
    let boardFull = false;
    let winningCombo = 'XXX';
    let buttons;
    let row;
    let col;
    let id;
    const display = document.getElementById('display-text');
    const buttonContainer = document.getElementById('button-container');
    const gameOverDisplay = document.getElementById('game-over-display-text');
    const reset = document.createElement('button');
    reset.setAttribute('id', 'reset-button');
    reset.textContent = 'Replay?';


    // player1.setPlayerName(prompt('Player 1 please enter your name...'));
    // player2.setPlayerName(prompt('Player 2 please enter your name...'));

    //  This function iterates through the columns, rows, and diagonals of the gameboard to see if there is
    //  a winning 3 in a row combo
    function checkWin() {
        winningCombo = currentPlayer.getPlayerSymbol()+currentPlayer.getPlayerSymbol()+ currentPlayer.getPlayerSymbol();
        board.setWinningSpaces();
        let winConditions = board.getWinningSpaces();
        console.log(winConditions);
        for (i = 0; i < 7; i++){
            if(winConditions[i] == winningCombo){
                gameWin = true;
                break;
            }
        }
    }

    // This function iterates through all spaces on the game board to see if there is an empty space
    //  it exits the iteration loop as soon as it finds an empty space, otherwise if the loop finishes
    //  normally and no space is found, then it will toggle board full to end the game in a tie
    function checkFull() {
        for(i = 0;i < 3;i++) {
            for(j = 0;j < 3;j++){
                if(board.getSymbol(i, j) == ''){
                    boardFull = false;
                    return;
                } else {
                    boardFull = true;
                }
            }
        }

    }

    //  this function plays a round of the game, allowing the current player to choose a spot on the gameboard
    //  to add their symbol to, checking if the spot is already occupied and making player choose again if so
    //  then adding their symbol to that spot if not. It then reprints the board, checks for win conditions and
    //  checks if the board is full, then prints the appropriate message and ends the game if either of those
    //  are true, otherwise it switches the current player to the other player to prepare for the next round
    function playRound() {
        display.textContent = `${currentPlayer.getPlayerName()}'s turn!`;
        buttons = Array.from(document.getElementsByClassName('cell'));
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                    id = button.getAttribute('id');
                    row = id.slice(0,1);
                    col = id.slice(2);
                    if ((board.getSymbol(row, col)) !== ''){
                        display.textContent = 'Space already occupied!';
                    } else {
                        board.addSymbol(row, col, currentPlayer.getPlayerSymbol());
                        board.eraseBoard();
                        board.printBoard();
                        checkWin();
                        checkFull();
                        if(gameWin || boardFull) {
                            if (gameWin) {
                                gameOverDisplay.textContent = `${currentPlayer.getPlayerName()} wins the game!`;
                            } else {
                                gameOverDisplay.textContent = 'Tie! Game Over!';
                            }
                            buttonContainer.appendChild(reset);
                            reset.addEventListener('click', () => {
                                board.resetValues();
                                gameWin = false;
                                boardFull = false;
                                playRound();
                                gameOverDisplay.textContent = '';
                                buttonContainer.removeChild(reset);
                            });

                        } else {
                            currentPlayer = currentPlayer === player1 ? player2 : player1;
                            playRound();
                        }
                    }
            });
        });
    }

    //  this function prints a new board, then plays a round with play round function until a win condition or tie condition
    //  is met, finally it asks the player if they want to play again and erases the board if so, otherwise it just says goodbye
    function playGame() {
        board.printBoard();
        playRound();
    }
    
    playGame();
    

}

gameController();