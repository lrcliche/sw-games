import React, { useState } from 'react';
import Square from './Square';
import { startConfetti, stopConfetti } from '../utils/confetti';
import { playSuccessSound, playErrorSound, playClickSound } from '../utils/sounds';

interface BoardProps {
  player1Name: string;
  player2Name: string;
}

const Board: React.FC<BoardProps> = ({ player1Name, player2Name }) => {
  const [board, setBoard] = useState(Array(16).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  type Player = 'X' | 'O';
  type SquareValue = Player | null;
  const [winner, setWinner] = useState<Player | null>(null);

  interface HandleClick {
    (index: number): void;
  }

  const handleClick: HandleClick = (index) => {
    if (winner || board[index]) return;

    const newBoard: SquareValue[] = [...board];
    newBoard[index] = currentPlayer as Player;
    setBoard(newBoard);

    const newWinner: SquareValue = calculateWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
      startConfetti();
      playSuccessSound();
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      if (newBoard.every((square) => square)) {
        playErrorSound();
      }
    }
  };

  const handleRestart = () => {
    setBoard(Array(16).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    stopConfetti();
    playClickSound();
  };

  const renderSquare = (index: number) => {
    return <Square value={board[index]} onClick={() => handleClick(index)} />;
  };

  let status;
  if (winner) {
    status = `Ganador: ${winner === 'X' ? player1Name : player2Name}`;
  } else if (board.every((square) => square)) {
    status = 'Empate';
  } else {
    status = `Siguiente jugador: ${currentPlayer === 'X' ? player1Name : player2Name}`;
  }

  return (
    <div>
      <div className="status">{status}</div>
      <div className="board">
        {Array(16).fill(null).map((_, i) => renderSquare(i))}
      </div>
      <button className="btn btn-secondary" onClick={handleRestart}>
        Reiniciar Juego
      </button>
    </div>
  );
};

function calculateWinner(squares : any) {
  const lines = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d]) {
      return squares[a];
    }
  }
  return null;
}

export default Board;
