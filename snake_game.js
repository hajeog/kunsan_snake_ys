// Create the game board
const gameBoard = document.getElementById('game-board');
const gridSize = 20;
const numRows = gameBoard.clientHeight / gridSize;
const numCols = gameBoard.clientWidth / gridSize;

// Create the initial snake
const initialSnake = [{ row: Math.floor(numRows / 2), col: Math.floor(numCols / 2) }];
let snake = [...initialSnake];

// Generate random food
let food = generateFood();

// Game loop interval ID
let gameLoopInterval;

// Start the game
function startGame() {
  gameLoopInterval = setInterval(gameLoop, 20); // Set snake movement time to 2 seconds
}

// Stop the game
function stopGame() {
  clearInterval(gameLoopInterval);
}

// Reset the game
function resetGame() {
  stopGame();
  snake = [...initialSnake];
  food = generateFood();
  updateGameBoard();
}

// Game loop
function gameLoop() {
  const direction = predictDirection();
  moveSnake(direction);
  if (isGameOver()) {
    console.log('Game Over');
    resetGame();
  }
}

// Generate random food position
function generateFood() {
  const row = Math.floor(Math.random() * numRows);
  const col = Math.floor(Math.random() * numCols);
  return { row, col };
}

// Predict the direction using TensorFlow.js
// Predict the direction using TensorFlow.js
function predictDirection() {
  const head = snake[0];
  const distances = {
    up: Math.sqrt((head.row - food.row - 1) ** 2 + (head.col - food.col) ** 2),
    down: Math.sqrt((head.row - food.row + 1) ** 2 + (head.col - food.col) ** 2),
    left: Math.sqrt((head.row - food.row) ** 2 + (head.col - food.col - 1) ** 2),
    right: Math.sqrt((head.row - food.row) ** 2 + (head.col - food.col + 1) ** 2)
  };

  // Remove directions that would collide with the snake's body
  const validDirections = Object.keys(distances).filter(dir => {
    const nextHead = getNextHeadPosition(dir);
    return !snake.some(segment => segment.row === nextHead.row && segment.col === nextHead.col);
  });

  const minDistance = Math.min(...validDirections.map(dir => distances[dir]));
  const closestDirections = validDirections.filter(dir => distances[dir] === minDistance);

  return closestDirections[Math.floor(Math.random() * closestDirections.length)];
}

function getNextHeadPosition(direction) {
  const head = snake[0];
  const nextHead = { ...head };

  switch (direction) {
    case 'up':
      nextHead.row--;
      break;
    case 'down':
      nextHead.row++;
      break;
    case 'left':
      nextHead.col--;
      break;
    case 'right':
      nextHead.col++;
      break;
  }

  return nextHead;
}

// Move the snake in the given direction
function moveSnake(direction) {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up':
      head.row--;
      break;
    case 'down':
      head.row++;
      break;
    case 'left':
      head.col--;
      break;
    case 'right':
      head.col++;
      break;
  }
  snake.unshift(head);
  if (head.row === food.row && head.col === food.col) {
    // Snake ate the food, generate new food
    food = generateFood();
  } else {
    snake.pop();
  }
  updateGameBoard();
}

// Check if the game is over
function isGameOver() {
  const head = snake[0];
  if (head.row < 0 || head.row >= numRows || head.col < 0 || head.col >= numCols) {
    return true; // Snake hit the wall
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].row === head.row && snake[i].col === head.col) {
      return true; // Snake bit itself
    }
  }
  return false;
}

// Update the game board
function updateGameBoard() {
  gameBoard.innerHTML = '';
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      if (row === food.row && col === food.col) {
        cell.classList.add('food');
      } else if (snake.some(segment => segment.row === row && segment.col === col)) {
        cell.classList.add('snake');
      }
      cell.style.top = `${row * gridSize}px`;
      cell.style.left = `${col * gridSize}px`;
      gameBoard.appendChild(cell);
    }
  }
}

// Add event listeners to buttons
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('stop-btn').addEventListener('click', stopGame);
document.getElementById('reset-btn').addEventListener('click', resetGame);
