import React, { useState, useEffect } from 'react';
import '../styles/MathGame.css';
import { playSuccessSound, playErrorSound } from '../utils/sounds';

type Question = {
  num1: number;
  num2: number;
  operator: string;
  correctAnswer: number;
};

const MathGame = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const generateQuestion = () => {
    let num1: number = 0, num2: number = 0, operator: string = '+', correctAnswer: number = 0;

    switch (difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operator = '+';
        correctAnswer = num1 + num2;
        break;
      case 'basic':
        num1 = Math.floor(Math.random() * 20) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        operator = Math.random() > 0.5 ? '+' : '-';
        if (operator === '-' && num1 < num2) {
          [num1, num2] = [num2, num1];
        }
        correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;
        break;
      case 'hard':
        num1 = Math.floor(Math.random() * 15) + 1;
        num2 = Math.floor(Math.random() * 15) + 1;
        operator = '*';
        correctAnswer = num1 * num2;
        break;
      default:
        num1 = 0;
        num2 = 0;
        operator = '+';
        correctAnswer = 0;
        break;
    }

    setQuestion({ num1, num2, operator, correctAnswer });
    setAnswer('');
    setMessage('');
  };

  useEffect(() => {
    generateQuestion();
  }, [difficulty]);

  interface HandleSubmitEvent extends React.FormEvent<HTMLFormElement> {}

  const handleSubmit = (e: HandleSubmitEvent) => {
    e.preventDefault();
    if (!question) return;
    if (parseInt(answer) === question.correctAnswer) {
      setMessage('¡Correcto!');
      setScore(score + 1);
      playSuccessSound();
      setTimeout(() => {
        generateQuestion();
      }, 1000);
    } else {
      setMessage('Incorrecto, intenta de nuevo.');
      playErrorSound();
    }
  };

  return (
    <div className="math-game">
      <h2>Juego de Matemáticas</h2>
      <div className="difficulty-selection">
        <button onClick={() => setDifficulty('easy')} className={`btn ${difficulty === 'easy' ? 'active' : ''}`}>Fácil</button>
        <button onClick={() => setDifficulty('basic')} className={`btn ${difficulty === 'basic' ? 'active' : ''}`}>Básico</button>
        <button onClick={() => setDifficulty('hard')} className={`btn ${difficulty === 'hard' ? 'active' : ''}`}>Difícil</button>
      </div>
      <div className="math-game-content">
        <div className="score">Puntuación: {score}</div>
        {question && (
          <div className="question">
            {question.num1} {question.operator} {question.num2} = ?
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="text-input"
            autoFocus
          />
          <button type="submit" className="btn">Enviar</button>
        </form>
        <div className="message">{message}</div>
      </div>
    </div>
  );
};

export default MathGame;
