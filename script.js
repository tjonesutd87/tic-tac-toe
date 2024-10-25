function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    const winningSpaces = [];
    const container = document.getElementById('container');
    
    //  push cells/spaces in the board array for each space on the gameboard by iterating through rows and columns.
    for (let i = 0; i < rows; i++){
        board[i] = [];
        for (let j = 0; j < columns; j++){
            board[i].push(cell());
        }
    }

    //  closure for getting the game board
    const getBoard = () => board;

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
        }

        //  create columns
        for (i = 2; i < 5; i++){
            winningSpaces[i] = [];
            for (j = 0; j < 3; j++){
                winningSpaces[i].push(board[j][i-2].getValue());
            }
            winningSpaces[i] = winningSpaces[i].join('');
        }
        //  create diagonals
        for (i = 5; i < 7; i++){
            winningSpaces[i] = [];
            for(j = 0; j < 3; j++){
                winningSpaces[i].push(board[j][j].getValue());
            }
            winningSpaces[i] = winningSpaces[i].join('');
        }
    };
    
    const getWinningSpaces = () => winningSpaces;

    //  closure function for drawing the gameboard to the console by retreiving the values of the cells with the cell object's getValue function
    const printBoard = () => {
        const cellContainer = document.getElementById('cell-container');
        container.appendChild(cellContainer);
        for (row in board) {
            for(cell in board[row]){
                const cellValue = document.createElement('button');
                const cellId = row + ',' + cell;
                cellValue.textContent = board[row][cell].getValue();
                cellValue.setAttribute('id', cellId)
                cellValue.setAttribute('class', 'cell-value');
                cellContainer.appendChild(cellValue);
            }
        }
        // const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        // console.log(boardWithCellValues);
    };

    const eraseBoard = () => board.map((row) => row.map((cell) => cell.setValue('')));

    const getSymbol = (row, col) => board[row-1][col-1].getValue();
    const addSymbol = (row, col, symbol) => board[row-1][col-1].setValue(symbol);

    //  Create the cell object that houses the getValue and addSymbol for getting and assigning values to the cells
    function cell() {
        let value = '';

        const setValue = (symbol) => value = symbol;
    
        const getValue = () => value;

        return {
            setValue,
            getValue
        };
    }

    return {
        getBoard,
        printBoard,
        eraseBoard,
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
    let reset = 'Y';
    let winningCombo = 'XXX';

    // player1.setPlayerName(prompt('Player 1 please enter your name...'));
    // player2.setPlayerName(prompt('Player 2 please enter your name...'));

    //  This function iterates through the columns, rows, and diagonals of the gameboard to see if there is
    //  a winning 3 in a row combo
    function checkWin() {
        winningCombo = currentPlayer.getPlayerSymbol()+currentPlayer.getPlayerSymbol()+ currentPlayer.getPlayerSymbol();
        board.setWinningSpaces();
        let winConditions = board.getWinningSpaces();
        for (i = 0; i < 8; i++){
            if(winConditions[i] == winningCombo){
                gameWin = true;
                console.log(`${currentPlayer.getPlayerName()} wins the game!`);
                break;
            }
        }
    }

    // This function iterates through all spaces on the game board to see if there is an empty space
    //  it exits the iteration loop as soon as it finds an empty space, otherwise if the loop finishes
    //  normally and no space is found, then it will toggle board full to end the game in a tie
    function checkFull() {
        for(i = 1;i < 3;i++) {
            for(j = 1;j < 3;j++){
                if(board.getSymbol(i, j) == ''){
                    break;
                }
            }
            if(board.getSymbol(i, j) == ''){
                break;
            }
        }
        if(board.getSymbol(i, j) == ''){
        } else {
            boardFull = true;
            console.log('Game Over, tie!');
        }
    }

    //  this function plays a round of the game, allowing the current player to choose a spot on the gameboard
    //  to add their symbol to, checking if the spot is already occupied and making player choose again if so
    //  then adding their symbol to that spot if not. It then reprints the board, checks for win conditions and
    //  checks if the board is full, then prints the appropriate message and ends the game if either of those
    //  are true, otherwise it switches the current player to the other player to prepare for the next round
    function playRound() {
        // let row = prompt(`${currentPlayer.getPlayerName()} select a row`);
        // while (row > 3 ||row < 1) {
        //     row = prompt(`Invalid selection, ${currentPlayer.getPlayerName()} select a row`);
        // }
        // let col = prompt(`${currentPlayer.getPlayerName()} select a column`);
        // while (col > 3 ||col < 1) {
        //     col = prompt(`Invalid selection, ${currentPlayer.getPlayerName()} select a column`);
        // }
        // while (board.getSymbol(row, col) !== ''){
        //     row = prompt(`Space already occupied, ${currentPlayer.getPlayerName()} select a row`);
        //     col = prompt(`${currentPlayer.getPlayerName()} select a column`);
        // }
        board.addSymbol(row, col, currentPlayer.getPlayerSymbol());
        board.printBoard();
        checkWin();
        checkFull();
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        console.log(gameWin);
        console.log(boardFull);
    }

    //  this function prints a new board, loops through the play round function until a win condition or tie condition
    //  is met, then asks the player if they want to play again and erases the board if so
    function playGame() {
        board.printBoard();
        while (!gameWin || !boardFull) {
            playRound();
            if(gameWin || boardFull) {
                reset = prompt('Play again? Y/N');
                if (reset == 'Y'){
                    board.eraseBoard();
                } else {
                    console.log('goodbye!');
                    break;
                }
            }
        }
    }

    while (reset == 'Y') {
        playGame();
    }

}

gameController();