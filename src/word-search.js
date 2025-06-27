export function setupWordSearch(element, player1Name) {
  const wordLists = {
    math: ["SUMA", "RESTA", "MULTIPLICACION", "DIVISION", "NUMERO", "ECUACION", "GEOMETRIA", "ALGEBRA", "CALCULO", "FRACCION"],
    computing: ["ORDENADOR", "PROGRAMACION", "INTERNET", "SOFTWARE", "HARDWARE", "TECLADO", "MOUSE", "CPU", "RED", "ALGORITMO"],
    food: ["MANZANA", "PLATANO", "ZANAHORIA", "LECHUGA", "ARROZ", "HUEVO", "QUESO", "POLLO", "PESCADO", "PASTA"],
    general: ["CASA", "ARBOL", "SOL", "LUNA", "ESTRELLA", "AGUA", "FUEGO", "TIERRA", "AIRE", "NUBE"]
  };

  let words = [];
  const gridSize = 10;
  let grid = [];
  let selectedCells = [];
  let foundWords = [];

  function getRandomWords(wordLists, count) {
    const categories = Object.keys(wordLists);
    let selectedWords = [];
    while (selectedWords.length < count) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const word = wordLists[category][Math.floor(Math.random() * wordLists[category].length)];
      if (!selectedWords.includes(word)) {
        selectedWords.push(word);
      }
    }
    return selectedWords;
  }

  function initializeWords() {
    words = getRandomWords(wordLists, 10);
  }

  function initializeGrid() {
    grid = Array.from({
      length: gridSize
    }, () => Array.from({
      length: gridSize
    }, () => ""));
    placeWords();
    fillEmptyCells();
    renderGrid();
  }

  function placeWords() {
    words.forEach(word => {
      let placed = false;
      while (!placed) {
        const x = Math.floor(Math.random() * gridSize);
        const y = Math.floor(Math.random() * gridSize);
        const direction = Math.floor(Math.random() * 2); // 0: horizontal, 1: vertical
        const dx = direction === 0 ? 1 : 0;
        const dy = direction === 1 ? 1 : 0;

        if (canPlaceWord(word, x, y, dx, dy)) {
          placeWord(word, x, y, dx, dy);
          placed = true;
        }
      }
    });
  }

  function canPlaceWord(word, x, y, dx, dy) {
    if (
      (dx === 1 && x + word.length > gridSize) ||
      (dy === 1 && y + word.length > gridSize)
    ) {
      return false;
    }
    for (let i = 0; i < word.length; i++) {
      const newX = x + i * dx;
      const newY = y + i * dy;
      if (grid[newY][newX] !== "" && grid[newY][newX] !== word[i]) {
        return false;
      }
    }
    return true;
  }

  function placeWord(word, x, y, dx, dy) {
    for (let i = 0; i < word.length; i++) {
      const newX = x + i * dx;
      const newY = y + i * dy;
      grid[newY][newX] = word[i];
    }
  }

  function fillEmptyCells() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        if (grid[y][x] === "") {
          grid[y][x] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }
  }

  function renderGrid() {
    const gridContainer = element.querySelector("#word-search-grid");
    gridContainer.innerHTML = "";
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cell = document.createElement("div");
        cell.classList.add("letter-cell");
        cell.dataset.x = x;
        cell.dataset.y = y;
        cell.textContent = grid[y][x];
        cell.addEventListener("click", handleCellSelection);
        gridContainer.appendChild(cell);
      }
    }
  }

  function handleCellSelection(event) {
    const cell = event.target;
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    const index = selectedCells.findIndex(c => c.x === x && c.y === y);
    if (index > -1) {
      selectedCells.splice(index, 1);
      cell.classList.remove("selected");
    } else {
      selectedCells.push({
        x,
        y,
        cell
      });
      cell.classList.add("selected");
    }
    checkWordSelection();
  }

  function checkWordSelection() {
    if (selectedCells.length < 3) return;

    const selectedWord = selectedCells
      .sort((a, b) => {
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
      })
      .map(cell => cell.cell.textContent)
      .join("");

    if (words.includes(selectedWord)) {
      markWordAsFound(selectedWord);
      clearSelectedCells();
    }
  }

  function markWordAsFound(word) {
    if (!foundWords.includes(word)) {
      foundWords.push(word);
      const wordList = element.querySelector("#word-search-words ul");
      const wordItem = Array.from(wordList.querySelectorAll("li")).find(
        li => li.textContent === word
      );
      if (wordItem) {
        wordItem.classList.add("found");
      }
      if (foundWords.length === words.length) {
        element.querySelector("#word-search-message").textContent = `¡Felicidades ${player1Name}! ¡Has encontrado todas las palabras!`;
      }
    }
  }

  function clearSelectedCells() {
    selectedCells.forEach(cell => cell.cell.classList.remove("selected"));
    selectedCells = [];
  }

  function renderWordList() {
    const wordList = element.querySelector("#word-search-words ul");
    wordList.innerHTML = "";
    words.forEach(word => {
      const li = document.createElement("li");
      li.textContent = word;
      wordList.appendChild(li);
    });
  }

  function restartGame() {
    foundWords = [];
    initializeWords();
    renderWordList();
    const wordList = element.querySelector("#word-search-words ul");
    wordList.querySelectorAll("li").forEach(li => li.classList.remove("found"));
    element.querySelector("#word-search-message").textContent = "";
    initializeGrid();
  }

  element
    .querySelector("#restartBtnWordSearch")
    .addEventListener("click", restartGame);

  initializeWords();
  renderWordList();
  initializeGrid();
}
