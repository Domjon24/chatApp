// const socket = io();
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector(".btn-secondary");
// const startBtn = document.querySelector(".btn-primary");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "#66B3BA";
const snakeColor = "#496F5D";
const snakeBorder = "black";
const foodColor = "#F6EFA6";
const hiddenInput = document.querySelector('#hiddenInput');
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [ //body parts of snake
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
// startBtn.addEventListener("click", gameStart);

// gameStart();

function gameStart(){
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
};
function hideStartBtn(){

    var button = document.getElementById('startBtn');  // Corrected ID to 'startBtn'
    button.style.display = "none";  // Hide the button

}
function nextTick(){
    if(running){
        setTimeout(()=> {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick()
        }, 100)
    }
    else {
        hiddenInput.value = "true"; 
        console.log("Game over. Input value is ", hiddenInput.value);
        displayGameOver();
    }
};
function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};
function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
};
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};
function moveSnake(){
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity};
    snake.unshift(head);
    if(snake[0].x == foodX && snake[0].y == foodY){
        score+=1;
        scoreText.textContent = score;
        createFood();
    }
    else{snake.pop();}

};
function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);

    })
};
function changeDirection(event){
    const keypressed = event.keyCode;
    const LEFT = 37;
    const RIGHT = 39;
    const UP = 38;
    const DOWN = 40;
    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);
    const goingRight = (xVelocity == unitSize);

    switch(true) {
        case(keypressed == LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keypressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keypressed == RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keypressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
};

//     switch(true){
//         case (snake[0].x < 0):
//             running = false;
//             if (!running) {
//                 socket.emit('gameOver', score); 
//             }
//             break;
//         case (snake[0].x >= gameWidth):
//             running = false;
//             if (!running) {
//                 socket.emit('gameOver', score);  // Emit game over event with the score
//             }
//             break;
//         case (snake[0].y < 0):
//             running = false;
//             if (!running) {
//                 socket.emit('gameOver', score);  // Emit game over event with the score
//             }
//             break;
//         case (snake[0].y >= gameHeight):
//             running = false;if (!running) {
//                 socket.emit('gameOver', score);  // Emit game over event with the score
//             }
//             break;
//     }
//     for (let i = 1; i < snake.length; i+=1){
//         if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
//             running = false;
//             if (!running) {
//                 socket.emit('gameOver', score);  // Emit game over event with the score
//             }
//         }
//     }
//     if (!running) {
//         socket.emit('gameOver', score);  // Emit game over event with the score
//     }
// };
function checkGameOver() {
    switch(true){
        case (snake[0].x < 0):
        case (snake[0].x >= gameWidth):
        case (snake[0].y < 0):
        case (snake[0].y >= gameHeight):
            running = false;
            break;
    }
    
    for (let i = 1; i < snake.length; i+=1) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false;
            break;
        }
    }

    if (!running) {
        socket.emit('gameOver', score);  // Emit game over event with the score
        displayGameOver();  
    }
};

function displayGameOver(){

    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.fillAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 4, gameHeight / 2);
    running = false;
};
function resetGame(){
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0
    snake =   [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];

    

    gameStart();
};

// io.emit(`user ${socket.id} just lost`);