import React, { useState, useEffect } from 'react';
import skeletonData from '../skeletonData.json';
import AudioPlayer from './AudioPlayer'; // Import the AudioPlayer component

export default function LessonPage() {
  const data = skeletonData;
  const [currentPage, setCurrentPage] = useState(0);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);

  useEffect(() => {
    if (
      currentElementIndex <
      data[currentPage]['bulletPoints'].length + 1
    ) {
      setTimeout(() => {
        setCurrentElementIndex((prevIndex) => prevIndex + 1);
      }, 1000);
    } else {
      if (currentPage < data.length - 1) {
        setCurrentElementIndex(0);
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  }, [currentPage, currentElementIndex, data]);

  console.log('Title:', data[currentPage]?.title);
  console.log(
    'Bullet Points:',
    data[currentPage].bulletPoints?.slice(0, currentElementIndex)
  );

  return (
    <div>
      <h1>Lesson Page</h1>
      <AudioPlayer src="/audio/part1.mp3" />
    </div>
  );
}
