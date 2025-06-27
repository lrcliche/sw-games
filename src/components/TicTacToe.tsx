import React, { useState } from 'react';
import Board from './Board';
import { startConfetti, stopConfetti } from '../utils/confetti';
import '../styles/TicTacToe.css';

const TicTacToe: React.FC = () => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = () => {
    setGameStarted(true);
  };

  return (
    <div>
      <h2>Tic Tac Toe</h2>
      {!gameStarted ? (
        <div id="player-input">
          <label htmlFor="player1Name">Nombre del Jugador 1:</label>
          <input
            type="text"
            id="player1Name"
            placeholder="Jugador 1"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
            className="text-input"
          />
          <label htmlFor="player2Name">Nombre del Jugador 2:</label>
          <input
            type="text"
            id="player2Name"
            placeholder="Jugador 2"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
            className="text-input"
          />
          <button id="startGameBtn" onClick={handleStartGame} className="btn">
            Comenzar Juego
          </button>
        </div>
      ) : (
        <Board player1Name={player1Name} player2Name={player2Name} />
      )}
    </div>
  );
};

export default TicTacToe;
