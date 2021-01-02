// Script implementing game rules and Minimax algorithm

const X = "X";
const O = "O";
const EMPTY = "";

function allSquaresFilled(board) {
    let count = 0;
    for (let i = 0; i < board.length; i++) {
        if (board[i] !== EMPTY) count++;
    }
    if (count === 9) {
        return true;
    }
    return false;
}

function initialState() {
    // returns the initial State of the board
    return [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY];
}

function player(board) {
    // return player who has next turn on board
    if (JSON.stringify(initialState()) == JSON.stringify(board)) return X;
    
    let x_count = 0;
    let o_count = 0;
    for (let i = 0; i < board.length; i++) {
        if (board[i] === X) {
            x_count += 1;
        }
        else if (board[i] === O) {
            o_count += 1;
        }
    }

    if (x_count > o_count) {
        return O;
    }
    else {
        return X;
    }
}

function actions(board) {
    // returns set(index) of all possible actions available on the board
    let validActions = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === EMPTY) validActions.push(i);
    }
    return validActions;
}

function result(board, action) {
    // return the copy of board after making an action
    let board_copy = JSON.parse(JSON.stringify(board));
    try {
        if ((board_copy[action] === EMPTY)) {
            board_copy[action] = player(board);
            return board_copy;
        }
    }
    catch {
        throw new Error("Invalid Move!");
    }
}

function winner(board) {
    // returns the winner of the game if there is one
    function gameWon(choice, inds) {
        if ((board[inds[0]] === choice) && (board[inds[1]] === choice) && (board[inds[2]] === choice)) {
            return choice;
        }
    }

    return (gameWon("X", [0, 1, 2]) || gameWon("O", [0, 1, 2]) || gameWon("X", [3, 4, 5]) ||
            gameWon("O", [3, 4, 5]) || gameWon("X", [6, 7, 8]) || gameWon("O", [6, 7, 8]) || 
            gameWon("X", [0, 3, 6]) || gameWon("O", [0, 3, 6]) || gameWon("X", [1, 4, 7]) ||
            gameWon("O", [1, 4, 7]) || gameWon("X", [2, 5, 8]) || gameWon("O", [2, 5, 8]) || 
            gameWon("X", [0, 4, 8]) || gameWon("O", [0, 4, 8]) || gameWon("X", [2, 4, 6]) ||
            gameWon("O", [2, 4, 6])); 
}

function terminal(board) {
    // returns true if game is over, false otherwise
    if (allSquaresFilled(board) && (winner(board) === undefined)) {
        return true;
    }
    if ((winner(board) === X) || (winner(board) === O)) {
        return true;
    }
    else if (winner(board) != undefined) return false;
}

function utility(board) {
    // returns 1 if X won, -1 if O won, 0 otherwise
    if (winner(board) === X) {
        return 1;
    }
    else if (winner(board) === O) {
        return -1;
    }
    return 0;
}

function minimax(board) {
    // returns the optimal action[index] for current player on board
    let act = null;

    if (JSON.stringify(board) == JSON.stringify(initialState())) {
        act = actions(board)[Math.floor(Math.random() * board.length)];
        return act;
    }
    else if (player(board) === X) {
        let v = -Infinity;
        for (let action of actions(board)) {
            let vNew = minValue(result(board, action));
            if (vNew > v) {
                v = vNew;
                act = action;
            }
        }
    }
    else {
        let v = Infinity;
        for (let action of actions(board)) {
            let vNew = maxValue(result(board, action));
            if (vNew < v) {
                v = vNew;
                act = action;
            }
        }
    }
    return act;
}

function maxValue(board) {
    if (terminal(board)) {
        return utility(board);
    }

    let v = -Infinity;
    for (let action of actions(board)) {
        v = Math.max(v, minValue(result(board, action)));
    }
    return v;
}

function minValue(board) {
    if (terminal(board)) {
        return utility(board);
    }

    let v = Infinity;
    for (let action of actions(board)) {
        v = Math.min(v, maxValue(result(board, action)));
    }
    
    return v;
}

export {winner, terminal, minimax};