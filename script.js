function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    
    //  push cells/spaces in the board array for each space on the gameboard by iterating through rows and columns.
    for (let i = 0; i < rows; i++){
        board[i] = [];
        for (let j = 0; j < columns; j++){
            board[i].push(cell());
        }
    }

    //  closure for getting the game board
    const getBoard = () => board;

    //  closure function for drawing the gameboard to the console by retreiving the values of the cells with the cell object's getValue function
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    const eraseBoard = () => board.map((row) => row.map((cell) => cell.setValue('')));

    //  Create the cell object that houses the getValue and addSymbol for getting and assigning values to the cells
    function cell() {
        let value = '';

        const addSymbol = (symbol) => {
            value = symbol;
        }
        const getValue = () => value;

        return {
            addSymbol,
            getValue
        };
    }

    return {
        getBoard,
        printBoard,
        eraseBoard
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
    board.printBoard();
    // player1.setPlayerName(prompt('Player 1 please enter your name...'));
    // player2.setPlayerName(prompt('Player 2 please enter your name...'));
    console.log(player1.getPlayerName());
    console.log(player2.getPlayerName());
    console.log(player2.getPlayerSymbol());
}

gameController();