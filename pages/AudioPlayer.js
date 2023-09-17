import React, { useEffect, useState } from 'react';

const AudioPlayer = ({ src, parentCallback, play }) => {

  useEffect(() => {
    console.log("received call: " + play)
    let audio = new Audio(src);

    // Ensure the audio object is defined before adding event listeners
    if (audio) {
      // Event listener to capture the audio duration
      audio.addEventListener('loadedmetadata', () => {

        // If a parent callback function is provided, call it with the duration
        if (parentCallback) {
          parentCallback(audio.duration);
        }
      });

      if(play){
        audio.play();
      }
    }
  }, [src, parentCallback]);

  return null;
};

export default AudioPlayer;
