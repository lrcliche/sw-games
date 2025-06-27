import React, { useState } from 'react';
import TicTacToe from './components/TicTacToe';
import WordSearch from './components/WordSearch';
import MathGame from './components/MathGame';
import JumpingGame from './components/JumpingGame';
import { playClickSound } from './utils/sounds';

const App: React.FC = () => {
  const [activeGame, setActiveGame] = useState('tic-tac-toe');

  const renderGame = () => {
    switch (activeGame) {
      case 'tic-tac-toe':
        return <TicTacToe />;
      case 'word-search':
        return <WordSearch />;
      case 'math-game':
        return <MathGame />;
      case 'jumping-game':
        return <JumpingGame />;
      default:
        return <TicTacToe />;
    }
  };

  return (
    <div id="app">
      <header>
        <img src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/gamers-logo-design-template-be3afbd9f04d8138acb6ef795c8976c7_screen.jpg?ts=1619011391" alt="Logo de la Plataforma" id="platform-logo" />
        <h1>Plataforma de Juegos Educativos</h1>
      </header>
      <nav>
        <ul>
          <li>
            <a href="#" onClick={() => { setActiveGame('tic-tac-toe'); playClickSound(); }}>
              Tic Tac Toe
            </a>
          </li>
          <li>
            <a href="#" onClick={() => { setActiveGame('word-search'); playClickSound(); }}>
              Sopa de Letras
            </a>
          </li>
          <li>
            <a href="#" onClick={() => { setActiveGame('math-game'); playClickSound(); }}>
              Juegos de Matemáticas
            </a>
          </li>
          <li>
            <a href="#" onClick={() => { setActiveGame('jumping-game'); playClickSound(); }}>
              Juegos de Saltos
            </a>
          </li>
        </ul>
      </nav>
      <div id="game-container">{renderGame()}</div>
    </div>
  );
};

export default App;