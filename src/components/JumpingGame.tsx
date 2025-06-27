import React, { useRef, useEffect, useState } from 'react';
import '../styles/JumpingGame.css';
import { playSuccessSound, playErrorSound } from '../utils/sounds';

const JumpingGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const isGameOverRef = useRef(false); // Referencia para sincronizar estado
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Variables del juego como refs para mantenerlas entre renders
  const playerRef = useRef<any>(null);
  const obstaclesRef = useRef<any[]>([]);
  const gameSpeedRef = useRef<number>(5);
  const frameRef = useRef<number>(0);
  const scoreCounterRef = useRef<number>(0);
  const avgSpeedSumRef = useRef<number>(0);
  const avgSpeedFramesRef = useRef<number>(0);

  // Función para inicializar el juego
  const init = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    playerRef.current = {
      x: 50,
      y: canvas.height - 60,
      width: 50,
      height: 50,
      velocityY: 0,
      isJumping: false,
    };
    obstaclesRef.current = [];
    gameSpeedRef.current = 2;
    frameRef.current = 0;
    scoreCounterRef.current = 0;
    avgSpeedSumRef.current = 0;
    avgSpeedFramesRef.current = 0;
    setScore(0);
    setIsGameOver(false);
    isGameOverRef.current = false;
    spawnObstacle();
    update();
  };

  // Función para crear obstáculos
  const spawnObstacle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    obstaclesRef.current.push({
      x: canvas.width,
      y: canvas.height - 60,
      width: 30,
      height: 50,
    });
  };

  // Función de salto
  const jump = () => {
    const player = playerRef.current;
    if (!player.isJumping && !isGameOverRef.current) {
      player.velocityY = -16; // Antes: -12
      player.isJumping = true;
    }
  };

  // Función de actualización del juego
  const update = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (isGameOverRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    frameRef.current++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player
    const player = playerRef.current;
    player.velocityY += 0.6; // Gravedad
    player.y += player.velocityY;

    // Guardar velocidad para promedio
    avgSpeedSumRef.current += Math.abs(player.velocityY);
    avgSpeedFramesRef.current++;

    if (player.y > canvas.height - 60) {
      player.y = canvas.height - 60;
      player.velocityY = 0;
      player.isJumping = false;
    }

    const playerImg = new window.Image();
    playerImg.src = '/player.svg';
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Obstacles
    const obstacleImg = new window.Image();
    obstacleImg.src = '/obstacle.svg';
    for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
      const o = obstaclesRef.current[i];
      o.x -= gameSpeedRef.current;
      ctx.drawImage(obstacleImg, o.x, o.y, o.width, o.height);

      // Colisión
      const playerBottom = player.y + player.height;
      const playerPrevBottom = player.y + player.height - player.velocityY;
      const obstacleTop = o.y;
      const isOverlapping =
        player.x < o.x + o.width &&
        player.x + player.width > o.x &&
        player.y < o.y + o.height &&
        playerBottom > o.y;

      // Permitir aterrizaje: solo perder si NO viene cayendo de arriba
      const isLanding =
        playerPrevBottom <= obstacleTop && // venía de arriba
        playerBottom >= obstacleTop &&
        player.x + player.width > o.x + 5 &&
        player.x < o.x + o.width - 5;

      if (isOverlapping && !isLanding) {
        isGameOverRef.current = true;
        setIsGameOver(true);
      }

      if (o.x + o.width < 0) {
        obstaclesRef.current.splice(i, 1);
        scoreCounterRef.current++;
        setScore(scoreCounterRef.current);
      }
    }

    // Increase difficulty
    if (frameRef.current % 200 === 0) {
      gameSpeedRef.current += 0.5;
    }

    // Score y promedio de velocidad
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(`Score: ${scoreCounterRef.current}`, 10, 30);
    const avgSpeed = (avgSpeedFramesRef.current > 0)
      ? (avgSpeedSumRef.current / avgSpeedFramesRef.current).toFixed(2)
      : '0.00';
    ctx.fillText(`Velocidad promedio salto: ${avgSpeed}`, 10, 60);

    if (
      obstaclesRef.current.length > 0 &&
      obstaclesRef.current[obstaclesRef.current.length - 1].x < canvas.width - 250
    ) {
      spawnObstacle();
    }

    animationRef.current = requestAnimationFrame(update);
  };

  // Efecto para listeners y arranque
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        jump();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const canvas = canvasRef.current;
    canvas?.addEventListener('click', jump);

    // Cargar imágenes y arrancar juego
    const playerImg = new window.Image();
    playerImg.src = '/player.svg';
    playerImg.onload = () => {
      init();
    };

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      canvas?.removeEventListener('click', jump);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  // Solo al montar
  }, []);

  // Reiniciar el juego
  const handleRestart = () => {
    isGameOverRef.current = false;
    setIsGameOver(false);
    setTimeout(() => {
      init();
    }, 100); // Pequeño delay para asegurar el reinicio limpio
  };

  return (
    <div className="jumping-game">
      <h2>Juego de Saltos</h2>
      <canvas ref={canvasRef} width="800" height="400" className="game-canvas"></canvas>
      {isGameOver && (
        <div className="game-over-overlay">
          <h3>Game Over</h3>
          <p>Tu puntuación: {score}</p>
          <button onClick={handleRestart} className="btn btn-info">Reiniciar</button>
        </div>
      )}
      <p>Presiona la barra espaciadora o haz clic para saltar.</p>
    </div>
  );
};

export default JumpingGame;

