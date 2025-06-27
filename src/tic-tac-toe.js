import ConfettiGenerator from "confetti-js";

export function setupTicTacToe(element, player1Name, player2Name) {
  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "X";
  let gameActive = true;
  let playerXName = player1Name || "Jugador 1";
  let playerOName = player2Name || "Jugador 2";
  let movesCount = 0;

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function checkWin() {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        gameActive = false;
        return board[a];
      }
    }
    return null;
  }

  function checkDraw() {
    return movesCount === 9;
  }

  function handleCellClick(index, cellElement) {
    if (board[index] === "" && gameActive) {
      board[index] = currentPlayer;
      cellElement.textContent = currentPlayer;
      movesCount++;
      const winner = checkWin();
      if (winner) {
        const winnerName = currentPlayer === "X" ? playerXName : playerOName;
        element.querySelector("#message").textContent = `¡${winnerName} gana!`;
        startConfetti();
      } else if (checkDraw()) {
        element.querySelector("#message").textContent = "¡Es un empate!";
        gameActive = false;
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        const nextPlayerName = currentPlayer === "X" ? playerXName : playerOName;
        element.querySelector("#message").textContent = `Turno de ${nextPlayerName} (${currentPlayer})`;
      }
    }
  }

  function restartGame() {
    board.fill("");
    currentPlayer = "X";
    gameActive = true;
    movesCount = 0;
    element
      .querySelectorAll(".cell")
      .forEach((cell) => (cell.textContent = ""));
    element.querySelector("#message").textContent = `Turno de ${playerXName} (X)`;
    stopConfetti();
  }

  element.querySelectorAll(".cell").forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(index, cell));
  });

  element
    .querySelector("#restartBtn")
    .addEventListener("click", restartGame);

  element.querySelector("#message").textContent = `Turno de ${playerXName} (X)`;

  // Confetti
  let confettiCanvas = null;
  let confetti = null;

  function startConfetti() {
    confettiCanvas = document.createElement('canvas');
    confettiCanvas.id = 'confetti-canvas';
    confettiCanvas.style.position = 'absolute';
    confettiCanvas.style.top = '0';
    confettiCanvas.style.left = '0';
    confettiCanvas.style.width = '100%';
    confettiCanvas.style.height = '100%';
    confettiCanvas.style.zIndex = '100';
    element.appendChild(confettiCanvas);
    confetti = new ConfettiGenerator({
      target: confettiCanvas,
      max: 80,
      size: 1,
      animate: true,
      props: ['circle', 'square', 'triangle', 'line'],
      colors: [[158, 125, 255], [255, 255, 255]]
    });
    confetti.render();
  }

  function stopConfetti() {
    if (confetti) {
      confetti.clear();
      confetti = null;
    }
    if (confettiCanvas) {
      confettiCanvas.remove();
      confettiCanvas = null;
    }
  }
}
