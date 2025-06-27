
const generateGrid = (words: string[], gridSize: number) => {
  const grid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(''));

  words.forEach((word) => {
    let placed = false;
    while (!placed) {
      const direction = Math.floor(Math.random() * 3);
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);

      if (direction === 0 && col + word.length <= gridSize) { // Horizontal
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          if (grid[row][col + i] !== '') {
            canPlace = false;
            break;
          }
        }
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[row][col + i] = word[i];
          }
          placed = true;
        }
      } else if (direction === 1 && row + word.length <= gridSize) { // Vertical
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          if (grid[row + i][col] !== '') {
            canPlace = false;
            break;
          }
        }
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[row + i][col] = word[i];
          }
          placed = true;
        }
      } else if (direction === 2 && row + word.length <= gridSize && col + word.length <= gridSize) { // Diagonal
        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          if (grid[row + i][col + i] !== '') {
            canPlace = false;
            break;
          }
        }
        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[row + i][col + i] = word[i];
          }
          placed = true;
        }
      }
    }
  });

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return grid;
};

export default generateGrid;
