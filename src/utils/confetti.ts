import ConfettiGenerator from 'confetti-js';

let confetti: any;

export const startConfetti = () => {
  const confettiElement = document.createElement('canvas');
  confettiElement.id = 'confetti-canvas';
  document.body.appendChild(confettiElement);

  confetti = new ConfettiGenerator({ target: confettiElement });
  confetti.render();
};

export const stopConfetti = () => {
  if (confetti) {
    confetti.clear();
    const confettiElement = document.getElementById('confetti-canvas');
    if (confettiElement) {
      confettiElement.remove();
    }
  }
};
