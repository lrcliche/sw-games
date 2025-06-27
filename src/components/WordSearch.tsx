import React, { useState, useEffect, useRef } from 'react';
import '../styles/WordSearch.css';
import generateGrid from '../utils/generateGrid';
import { wordDictionary } from '../utils/wordDictionary';
import confetti from 'canvas-confetti';
import { playSuccessSound, playErrorSound } from '../utils/sounds';

const gridSize = 12;

const getRandomWords = () => {
  const allWords = Object.values(wordDictionary).flat();
  const shuffled = allWords.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
};

const WordSearch = () => {
  const [words, setWords] = useState(getRandomWords());
  const [grid, setGrid] = useState<any[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selection, setSelection] = useState<{ start: any; end: any; } | null>(null);
  const isSelecting = useRef(false);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (foundWords.length === words.length && words.length > 0) {
      celebrate();
      setTimeout(() => {
        startNewGame();
      }, 3000);
    }
  }, [foundWords, words]);

  const startNewGame = () => {
    const newWords = getRandomWords();
    setWords(newWords);
    setGrid(generateGrid(newWords, gridSize));
    setFoundWords([]);
  };

  const celebrate = () => {
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { y: 0.6 },
    });
  };

  const handleMouseDown = (rowIndex: any, colIndex: any) => {
    isSelecting.current = true;
    setSelection({ start: { row: rowIndex, col: colIndex }, end: { row: rowIndex, col: colIndex } });
  };

  const handleMouseMove = (rowIndex: any, colIndex: any) => {
    if (isSelecting.current) {
      setSelection((prev: any) => ({ ...prev, end: { row: rowIndex, col: colIndex } }));
    }
  };

  const handleMouseUp = () => {
    isSelecting.current = false;
    if (selection) {
      const selectedWord = getWordFromSelection(selection);
      if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
        setFoundWords([...foundWords, selectedWord]);
        playSuccessSound();
      } else {
        playErrorSound();
      }
    }
    setSelection(null);
  };

  const getWordFromSelection = (selection: { start: any; end: any; }) => {
    let word = '';
    const { start, end } = selection;
    if (start.row === end.row) { // Horizontal
      for (let i = Math.min(start.col, end.col); i <= Math.max(start.col, end.col); i++) {
        word += grid[start.row][i];
      }
    } else if (start.col === end.col) { // Vertical
      for (let i = Math.min(start.row, end.row); i <= Math.max(start.row, end.row); i++) {
        word += grid[i][start.col];
      }
    } else if (Math.abs(end.row - start.row) === Math.abs(end.col - start.col)) { // Diagonal
      const rowStep = end.row > start.row ? 1 : -1;
      const colStep = end.col > start.col ? 1 : -1;
      let { row, col } = start;
      while (row !== end.row + rowStep && col !== end.col + colStep) {
        word += grid[row][col];
        row += rowStep;
        col += colStep;
      }
    }
    return word;
  };

  const isCellSelected = (rowIndex: number, colIndex: number) => {
    if (!selection) return false;
    const { start, end } = selection;
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);

    if (start.row === end.row) return rowIndex === start.row && colIndex >= minCol && colIndex <= maxCol;
    if (start.col === end.col) return colIndex === start.col && rowIndex >= minRow && rowIndex <= maxRow;
    if (Math.abs(end.row - start.row) === Math.abs(end.col - start.col)) {
        const rowStep = end.row > start.row ? 1 : -1;
        const colStep = end.col > start.col ? 1 : -1;
        let { row, col } = start;
        while (row !== end.row + rowStep && col !== end.col + colStep) {
            if(rowIndex === row && colIndex === col) return true;
            row += rowStep;
            col += colStep;
        }
    }
    return false;
  };

  return (
    <div className="word-search-game">
      <h2>Sopa de Letras</h2>
      <div className="word-search-container">
        <div className="word-search-grid" onMouseUp={handleMouseUp}>
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="grid-row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`grid-cell ${isCellSelected(rowIndex, colIndex) ? 'selected' : ''}`}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseMove={() => handleMouseMove(rowIndex, colIndex)}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="word-list">
          <h3>Palabras a encontrar:</h3>
          <ul>
            {words.map((word) => (
              <li key={word} className={foundWords.includes(word) ? 'found' : ''}>
                {word}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WordSearch;
