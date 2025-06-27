export function setupJumpingGame(element, player1Name) {
  const canvas = element.querySelector("#jumping-canvas");
  const ctx = canvas.getContext("2d");
  let player = {
    x: 50,
    y: canvas.height - 50,
    width: 20,
    height: 50,
    isJumping: false,
    yVelocity: 0,
  };
  let obstacles = [];
  let score = 0;
  let gameSpeed = 2;
  let isGameOver = false;

  function generateObstacle() {
    const obstacleWidth = 30 + Math.random() * 20;
    const obstacleHeight = 30 + Math.random() * 30;
    const obstacleX = canvas.width;
    const obstacleY = canvas.height - obstacleHeight;
    obstacles.push({
      x: obstacleX,
      y: obstacleY,
      width: obstacleWidth,
      height: obstacleHeight,
    });
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawPlayer() {
    ctx.fillStyle = "#9C7DFF";
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }

  function drawObstacles() {
    ctx.fillStyle = "black";
    obstacles.forEach((obstacle) => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
  }

  function updatePlayer() {
    if (player.isJumping) {
      player.y += player.yVelocity;
      player.yVelocity += 1.5;
      if (player.y > canvas.height - 50) {
        player.y = canvas.height - 50;
        player.isJumping = false;
      }
    }
  }

  function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
      obstacles[i].x -= gameSpeed;
    }

    if (obstacles.length > 0 && obstacles[0].x < -obstacles[0].width) {
      obstacles.shift();
      score++;
    }

    if (Math.random() < 0.01) {
      generateObstacle();
    }
  }

  function checkCollisions() {
    for (let obstacle of obstacles) {
      if (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
      ) {
        isGameOver = true;
        element.querySelector("#jumping-message").textContent = `¡Game Over, ${player1Name}! Score: ${score}`;
      }
    }
  }

  function gameLoop() {
    if (!isGameOver) {
      clearCanvas();
      drawPlayer();
      drawObstacles();
      updatePlayer();
      updateObstacles();
      checkCollisions();
      requestAnimationFrame(gameLoop);
    }
  }

  function startGame() {
    isGameOver = false;
    score = 0;
    obstacles = [];
    player.y = canvas.height - 50;
    element.querySelector("#jumping-message").textContent = "";
    gameLoop();
  }

  function restartGame() {
    startGame();
  }

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space" && !player.isJumping) {
      player.isJumping = true;
      player.yVelocity = -20;
    }
  });

  element.querySelector("#restartBtnJumping").addEventListener("click", restartGame);

  startGame();
}
