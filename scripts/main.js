import * as Minimax from "./minimax.js";

const gameBoardHtml = document.getElementById("gameboard");
const playerChoiceDiv = document.getElementById("player-choice");
const onePlayerButton = document.getElementById("one-player");
const twoPlayerButton = document.getElementById("two-player");
const playAgainButton = document.getElementById("play-again");
const gameChoiceDiv = document.getElementById("game-choice");
const choiceXButton = document.getElementById("choice-x");
const choiceOButton = document.getElementById("choice-o");
const h3 = document.querySelector("h3");
const header = document.getElementById("header");

let playerOne = null;
let playerTwo = null;

const Player = function (choice, madeMove) {
    return {choice, madeMove};
}

let choseOnePlayer, choseTwoPlayer;
onePlayerButton.addEventListener("click", function() {
    choseOnePlayer = true;
    choseTwoPlayer = false;
    playerChoiceDiv.style.display = "none";
    gameChoiceDiv.style.display = "flex";
    h3.textContent = "Your Choice?";
});

twoPlayerButton.addEventListener("click", function() {
    choseTwoPlayer = true;
    choseOnePlayer = false;
    playerChoiceDiv.style.display = "none";
    gameChoiceDiv.style.display = "flex";
    h3.textContent = "Your Choice?";
});

choiceXButton.addEventListener("click", function() {
    playerOne = Player(choiceXButton.textContent.slice(-1), false);
    playerTwo = Player(choiceOButton.textContent.slice(-1), false);
    gameChoiceDiv.style.display = "none";
    gameBoardHtml.style.display = "flex";
    header.style.height = "60px";

    drawNewBoard();
    playMove(choseOnePlayer, choseTwoPlayer);
});

choiceOButton.addEventListener("click", function() {
    playerOne = Player(choiceOButton.textContent.slice(-1), false);
    playerTwo = Player(choiceXButton.textContent.slice(-1), false);
    gameChoiceDiv.style.display = "none";
    gameBoardHtml.style.display = "flex";
    header.style.height = "60px";

    drawNewBoard();
    playMove(choseOnePlayer, choseTwoPlayer);
});

playAgainButton.addEventListener("click", function() {
    clear();
    playAgainButton.style.display = "none";
    playerChoiceDiv.style.display = "flex";
    gameBoardHtml.style.display = "none";
    h3.textContent = "How do you want to play?";
    header.style.height = "200px";
});

function drawNewBoard() {
    for (let i = 0; i < 9; i++) {
        const div = document.createElement("div");
        div.classList.add("square");
        div.setAttribute("id", `square-${i}`);
        gameBoardHtml.appendChild(div);
    }
}

function getCurrentBoard() {
    const board = [];
    const squares = document.querySelectorAll(".square");
    squares.forEach((square) => board.push(square.textContent));
    return board;
}

async function playMove(onePlayer, twoPlayer) {
    const board = getCurrentBoard();
    const squares = document.querySelectorAll(".square");
    const h3 = document.querySelector("h3");  

    // If the game is over
    if (Minimax.terminal(board)) {
        const winner = Minimax.winner(board);
        if (winner == undefined) {
            h3.textContent = "Game Tied!";
        }
        else if ((winner === playerOne.choice)) {
            h3.textContent = `${playerOne.choice} wins`;
        }
        else {
            h3.textContent = `${playerTwo.choice} wins`;
        }

        playAgainButton.style.display = "block";
        return;
    }
    
    else if (onePlayer) {  
        // X goes first 
        if (playerTwo.choice === "X") {
            const board = getCurrentBoard();
            if (!Minimax.terminal(board)) {
                h3.textContent = "Computer Thinking...";
                await sleep(1000);  // sleep for 1 second.
                let bestAction = Minimax.minimax(board);
                squares[bestAction].textContent = playerTwo.choice;
                playerOne.madeMove = false;
                playerTwo.madeMove = true;
            }
        }
        
        h3.textContent = `${playerOne.choice}'s turn`;
        squares.forEach((square) => square.addEventListener("click", async function() {
            const board = getCurrentBoard();
            if (!Minimax.terminal(board) && (this.textContent === "")) {

                if (!playerOne.madeMove) {
                    h3.textContent = "Computer Thinking...";
                    this.textContent = playerOne.choice;
                    playerOne.madeMove = true;
                    playerTwo.madeMove = false;
                }
                
                await sleep(1000);  // sleep for 1 second.
                if (!playerTwo.madeMove) {
                    const board = getCurrentBoard();
                    if (!Minimax.terminal(board)) {
                        h3.textContent = `${playerOne.choice}'s turn`;
                        let bestAction = Minimax.minimax(board);
                        squares[bestAction].textContent = playerTwo.choice;
                        playerOne.madeMove = false;
                        playerTwo.madeMove = true;
                    }
                }
                playMove();
            }
        }));
    }

    else if (twoPlayer) {
        h3.textContent = `${playerOne.choice}'s turn`;
        squares.forEach((square) => square.addEventListener("click", function() {
            const board = getCurrentBoard();
            if (!Minimax.terminal(board) && (this.textContent === "")) {
                
                if (!playerOne.madeMove) {
                    this.textContent = playerOne.choice;
                    playerOne.madeMove = true;
                    playerTwo.madeMove = false;
                    h3.textContent = `${playerTwo.choice}'s turn`;
                }
                else if (!playerTwo.madeMove) {
                    this.textContent = playerTwo.choice;
                    playerOne.madeMove = false;
                    playerTwo.madeMove = true;
                    h3.textContent = `${playerOne.choice}'s turn`;
                }
                playMove();
            }
        }));
    }
}

function clear() {
    while(gameBoardHtml.hasChildNodes()) {
        gameBoardHtml.removeChild(gameBoardHtml.childNodes[0]);
    }
    playerOne = null;
    playerTwo = null;
}

// Source - https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}