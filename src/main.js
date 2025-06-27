import "../style.css";
import {
  setupTicTacToe
} from "./tic-tac-toe.js";
import {
  setupWordSearch
} from "./word-search.js";
import {
  setupMathGame
} from "./math-game.js";
import {
  setupJumpingGame
} from "./jumping-game.js";

document.querySelector("#app").innerHTML = `
  <header>
    <img src="/logo.png" alt="Logo de la Plataforma" id="platform-logo">
    <h1>Plataforma de Juegos Educativos</h1>
  </header>
  <nav>
    <ul>
      <li><a href="#" data-game="tic-tac-toe">Tic Tac Toe</a></li>
      <li><a href="#" data-game="word-search">Sopa de Letras</a></li>
      <li><a href="#" data-game="math-game">Juegos de Matemáticas</a></li>
      <li><a href="#" data-game="jumping-game">Juegos de Saltos</a></li>
    </ul>
  </nav>
  <div id="game-container">
    <div id="tic-tac-toe" style="display: none;">
      <h2>Tic Tac Toe</h2>
      <div id="player-input">
        <label for="player1Name">Nombre del Jugador 1:</label>
        <input type="text" id="player1Name" placeholder="Jugador 1">
        <label for="player2Name">Nombre del Jugador 2:</label>
        <input type="text" id="player2Name" placeholder="Jugador 2">
        <button id="startGameBtn">Comenzar Juego</button>
      </div>
      <div id="gameboard" style="display: none;">
        <div class="cell" data-index="0"></div>
        <div class="cell" data-index="1"></div>
        <div class="cell" data-index="2"></div>
        <div class="cell" data-index="3"></div>
        <div class="cell" data-index="4"></div>
        <div class="cell" data-index="5"></div>
        <div class="cell" data-index="6"></div>
        <div class="cell" data-index="7"></div>
        <div class="cell" data-index="8"></div>
      </div>
      <div id="message"></div>
      <button id="restartBtn" style="display: none;">Reiniciar Juego</button>
    </div>

    <div id="word-search" style="display: none;">
      <h2>Sopa de Letras</h2>
      <div id="word-search-input">
        <label for="player1NameWordSearch">Nombre del Jugador:</label>
        <input type="text" id="player1NameWordSearch" placeholder="Jugador">
        <button id="startGameBtnWordSearch">Comenzar Juego</button>
      </div>
      <div id="word-search-game" style="display: none;">
        <div id="word-search-grid"></div>
        <div id="word-search-words">
          <ul></ul>
        </div>
      </div>
      <div id="word-search-message"></div>
      <button id="restartBtnWordSearch" style="display: none;">Reiniciar Juego</button>
    </div>

    <div id="math-game" style="display: none;">
      <h2>Juegos de Matemáticas</h2>
      <div id="math-game-input">
        <label for="player1NameMath">Nombre del Jugador:</label>
        <input type="text" id="player1NameMath" placeholder="Jugador">
        <button id="startGameBtnMath">Comenzar Juego</button>
      </div>
      <div id="math-game-content" style="display: none;">
        <div id="math-question"></div>
        <input type="number" id="math-answer" placeholder="Tu respuesta">
        <button id="submitBtnMath">Enviar Respuesta</button>
        <div id="math-message"></div>
        <div id="difficulty-selection">
          <button id="facilBtn">Fácil</button>
          <button id="basicoBtn">Básico</button>
          <button id="dificilBtn">Difícil</button>
        </div>
      </div>
      <button id="restartBtnMath" style="display: none;">Reiniciar Juego</button>
    </div>

    <div id="jumping-game" style="display: none;">
      <h2>Juegos de Saltos</h2>
      <div id="jumping-game-input">
        <label for="player1NameJumping">Nombre del Jugador:</label>
        <input type="text" id="player1NameJumping" placeholder="Jugador">
        <button id="startGameBtnJumping">Comenzar Juego</button>
      </div>
      <div id="jumping-game-content" style="display: none;">
        <canvas id="jumping-canvas" width="400" height="300"></canvas>
        <div id="jumping-message"></div>
      </div>
      <button id="restartBtnJumping" style="display: none;">Reiniciar Juego</button>
    </div>
  </div>
`;

const appElement = document.querySelector("#app");
const gameContainer = appElement.querySelector("#game-container");

function hideAllGames() {
  gameContainer.querySelectorAll("#game-container > div").forEach(game => {
    game.style.display = "none";
  });
}

function showGame(gameId) {
  hideAllGames();
  document.getElementById(gameId).style.display = "block";
}

appElement.querySelector("nav ul").addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    const gameId = event.target.dataset.game;
    showGame(gameId);
    switch (gameId) {
      case "tic-tac-toe":
        setupTicTacToeGame();
        break;
      case "word-search":
        setupWordSearchGame();
        break;
      case "math-game":
        setupMathGameGame();
        break;
      case "jumping-game":
        setupJumpingGameGame();
        break;
    }
  }
});

// Tic Tac Toe
function setupTicTacToeGame() {
  const ticTacToeElement = document.getElementById("tic-tac-toe");
  const playerInput = ticTacToeElement.querySelector("#player-input");
  const gameboard = ticTacToeElement.querySelector("#gameboard");
  const restartBtn = ticTacToeElement.querySelector("#restartBtn");
  let player1Name = "";
  let player2Name = "";

  const startGameBtn = ticTacToeElement.querySelector("#startGameBtn");
  startGameBtn.addEventListener("click", () => {
    player1Name = ticTacToeElement.querySelector("#player1Name").value;
    player2Name = ticTacToeElement.querySelector("#player2Name").value;
    if (player1Name && player2Name) {
      playerInput.style.display = "none";
      gameboard.style.display = "grid";
      restartBtn.style.display = "block";
      setupTicTacToe(ticTacToeElement, player1Name, player2Name);
    } else {
      alert("Por favor, ingresa los nombres de ambos jugadores.");
    }
  });

  function startGame() {
    playerInput.style.display = "block";
    gameboard.style.display = "none";
    restartBtn.style.display = "none";
  }

  startGame();
}

// Word Search
function setupWordSearchGame() {
  const wordSearchElement = document.getElementById("word-search");
  const playerInput = wordSearchElement.querySelector("#word-search-input");
  const gameContent = wordSearchElement.querySelector("#word-search-game");
  const restartBtn = wordSearchElement.querySelector("#restartBtnWordSearch");
  let player1Name = "";

  const startGameBtn = wordSearchElement.querySelector("#startGameBtnWordSearch");
  startGameBtn.addEventListener("click", () => {
    player1Name = wordSearchElement.querySelector("#player1NameWordSearch").value;
    if (player1Name) {
      playerInput.style.display = "none";
      gameContent.style.display = "flex";
      restartBtn.style.display = "block";
      setupWordSearch(wordSearchElement, player1Name);
    } else {
      alert("Por favor, ingresa el nombre del jugador.");
    }
  });

  function startGame() {
    playerInput.style.display = "block";
    gameContent.style.display = "none";
    restartBtn.style.display = "none";
  }

  startGame();
}

// Math Game
function setupMathGameGame() {
  const mathGameElement = document.getElementById("math-game");
  const playerInput = mathGameElement.querySelector("#math-game-input");
  const gameContent = mathGameElement.querySelector("#math-game-content");
  const restartBtn = mathGameElement.querySelector("#restartBtnMath");
  let player1Name = "";

  const startGameBtn = mathGameElement.querySelector("#startGameBtnMath");
  startGameBtn.addEventListener("click", () => {
    player1Name = mathGameElement.querySelector("#player1NameMath").value;
    if (player1Name) {
      playerInput.style.display = "none";
      gameContent.style.display = "block";
      restartBtn.style.display = "block";
      setupMathGame(mathGameElement, player1Name);
    } else {
      alert("Por favor, ingresa el nombre del jugador.");
    }
  });

  function startGame() {
    playerInput.style.display = "block";
    gameContent.style.display = "none";
    restartBtn.style.display = "none";
  }

  startGame();
}

// Jumping Game
function setupJumpingGameGame() {
  const jumpingGameElement = document.getElementById("jumping-game");
  const playerInput = jumpingGameElement.querySelector("#jumping-game-input");
  const gameContent = jumpingGameElement.querySelector("#jumping-game-content");
  const restartBtn = jumpingGameElement.querySelector("#restartBtnJumping");
  let player1Name = "";

  const startGameBtn = jumpingGameElement.querySelector("#startGameBtnJumping");
  startGameBtn.addEventListener("click", () => {
    player1Name = jumpingGameElement.querySelector("#player1NameJumping").value;
    if (player1Name) {
      playerInput.style.display = "none";
      gameContent.style.display = "block";
      restartBtn.style.display = "block";
      setupJumpingGame(jumpingGameElement, player1Name);
    } else {
      alert("Por favor, ingresa el nombre del jugador.");
    }
  });

  function startGame() {
    playerInput.style.display = "block";
    gameContent.style.display = "none";
    restartBtn.style.display = "none";
  }

  startGame();
}

// Initially show Tic Tac Toe
showGame("tic-tac-toe");
setupTicTacToeGame();
