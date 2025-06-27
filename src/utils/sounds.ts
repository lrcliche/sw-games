let isPlaying = false;
export const playSuccessSound = () => {
  if (isPlaying) return; // Prevent multiple plays
  isPlaying = true;
  const audio = new Audio('/audio/ok.mp3');
  audio.play();
  audio.onended = () => {
    isPlaying = false; // Reset after sound ends
  };
  audio.onerror = () => {
    console.error('Error playing success sound');
    isPlaying = false; // Reset on error
  }
};

export const playErrorSound = () => {
  if (isPlaying) return; // Prevent multiple plays
  isPlaying = true;
  const audio = new Audio('/audio/error.mp3');
  audio.play();
  audio.onended = () => {
    isPlaying = false; // Reset after sound ends
  };
  audio.onerror = () => {
    console.error('Error playing error sound');
    isPlaying = false; // Reset on error
  }
};

export const playClickSound = () => {
  if (isPlaying) return; // Prevent multiple plays
  isPlaying = true;
  const audio = new Audio('/audio/click.mp3');
  audio.play();
  audio.onended = () => {
    isPlaying = false; // Reset after sound ends
  };
  audio.onerror = () => {
    console.error('Error playing click sound');
    isPlaying = false; // Reset on error
  }
};