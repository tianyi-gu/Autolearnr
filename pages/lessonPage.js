import React, { useState, useEffect } from 'react';
import skeletonData from '../skeletonData.json';
import AudioPlayer from './AudioPlayer';

export default function LessonPage() {
    const data = skeletonData;
    const [currentPage, setCurrentPage] = useState(0);
    const [currentElementIndex, setCurrentElementIndex] = useState(0);
    const [audioPath, setAudioPath] = useState(`/audio/${data[0].name}.mp3`);
    const [audioDuration, setAudioDuration] = useState(null);
    const [needNewAudio, setNeedNewAudio] = useState(true);

    const handleAudioDuration = (duration) => {
        if (audioDuration === null) {
            setAudioDuration(duration);
        }
        setNeedNewAudio(false)
        console.log(duration)
    };

    useEffect(() => {
        if (audioDuration !== null) {
            console.log("interval started!")
            if (currentElementIndex < data[currentPage].bulletPoints.length) {
                setNeedNewAudio(false);
                
                // Automatically advance to the next element when the element duration elapses
                const intervalId = setTimeout(() => {
                    setCurrentElementIndex((prevIndex) => prevIndex + 1);
                }, audioDuration * 1000 / (data[currentPage].bulletPoints.length));

                // Clean up the interval when the component unmounts or when the element changes
                return () => {
                    clearTimeout(intervalId);
                };
            } else {
                // If all elements have been displayed, move to the next page
                if (currentPage < data.length - 1) {
                    setAudioPath(`/audio/${data[currentPage + 1].name}.mp3`);
                    setCurrentElementIndex(0);
                    setCurrentPage((prevPage) => prevPage + 1);
                    setAudioDuration(null); // Reset audio duration for the new audio
                    setNeedNewAudio(true);
                }
            }
        }
    }, [currentPage, currentElementIndex, data, needNewAudio]);

    console.log('Page Number:', currentPage);
    console.log('Page Duration:', audioDuration);

    return (
        <div>
            <h2>{data[currentPage]?.title}</h2>
            <div>
                <ul>
                    {data[currentPage].bulletPoints
                        ?.slice(0, currentElementIndex + 1)
                        .map((expression, index) => (
                            <li key={index}>{expression}</li>
                        ))}
                </ul>
            </div>
            {needNewAudio && <AudioPlayer
                src={audioPath}
                play={needNewAudio}
                parentCallback={handleAudioDuration}
            />}
        </div>
    );
}
