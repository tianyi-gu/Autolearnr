// AudioPlayer.js
import React, { useEffect } from 'react';

const AudioPlayer = ({ src }) => {
  useEffect(() => {
    const audio = new Audio(src);
    audio.play();

    return () => {
      audio.pause();
    };
  }, [src]);

  return null; 
};

export default AudioPlayer;
