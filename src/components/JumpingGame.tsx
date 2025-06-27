import React, { useRef, useEffect, useState } from 'react';
import '../styles/JumpingGame.css';
import { playSuccessSound, playErrorSound } from '../utils/sounds';

const JumpingGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let player: any, obstacles: any[], gameSpeed: number, frame: number, scoreCounter: number;

    const playerImg = new Image();
    playerImg.src = '/player.svg';

    const obstacleImg = new Image();
    obstacleImg.src = '/obstacle.svg';

    function init() { 
      if (!canvas) return;
      player = {
        x: 50,
        y: canvas.height - 60,
        width: 50,
        height: 50,
        velocityY: 0,
        isJumping: false,
      };
      obstacles = [];
      gameSpeed = 5;
      frame = 0;
      scoreCounter = 0;
      setScore(0);
      setIsGameOver(false);
      spawnObstacle();
      update();
    }

    function spawnObstacle() {
      if (!canvas) return;
      const obstacle = {
        x: canvas.width,
        y: canvas.height - 60,
        width: 30,
        height: 50,
      };
      obstacles.push(obstacle);
    }

    function jump() {
      if (!player.isJumping && !isGameOver) {
        player.velocityY = -12;
        player.isJumping = true;
      }
    }

    function update() {
      if (isGameOver) return;
      if (!ctx || !canvas) return;

      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Player
      player.velocityY += 0.5; // Gravity
      player.y += player.velocityY;

      if (player.y > canvas.height - 60) {
        player.y = canvas.height - 60;
        player.velocityY = 0;
        player.isJumping = false;
      }

      ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

      // Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const o = obstacles[i];
        o.x -= gameSpeed;
        ctx.drawImage(obstacleImg, o.x, o.y, o.width, o.height);

        // Collision
        if (
          player.x < o.x + o.width &&
          player.x + player.width > o.x &&
          player.y < o.y + o.height &&
          player.y + player.height > o.y
        ) {
          setIsGameOver(true);
          //playErrorSound();
        }

        if (o.x + o.width < 0) {
          obstacles.splice(i, 1);
          scoreCounter++;
          setScore(scoreCounter);
          playSuccessSound();
        }
      }

      // Increase difficulty
      if (frame % 200 === 0) {
        gameSpeed += 0.5;
      }

      // Score
      ctx.fillStyle = '#2c3e50';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Score: ${scoreCounter}`, 10, 30);

      if (obstacles.length > 0 && obstacles[obstacles.length - 1].x < canvas.width - 250) {
        spawnObstacle();
      }

      requestAnimationFrame(update);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        jump();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('click', jump);

    playerImg.onload = () => {
        init();
    }

    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    }

  }, [isGameOver]); // Rerun effect when game is over to stop the loop

  const handleRestart = () => {
    setIsGameOver(false);
  };

  return (
    <div className="jumping-game">
      <h2>Juego de Saltos</h2>
      <canvas ref={canvasRef} width="800" height="400" className="game-canvas"></canvas>
      {isGameOver && (
        <div className="game-over-overlay">
            <h3>Game Over</h3>
            <p>Tu puntuación: {score}</p>
            <button onClick={handleRestart} className="btn">Reiniciar</button>
        </div>
      )}
      <p>Presiona la barra espaciadora o haz clic para saltar.</p>
    </div>
  );
};

export default JumpingGame;

