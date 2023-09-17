import SkeletonNotes from '../components/SkeletonNotes';
import skeletonData from '../skeletonData.json';

import { useEffect, useState } from 'react';

const LessonPage = () => {
    const data = skeletonData;
    const [currentPage, setCurrentPage] = useState(0);
    const [currentElementIndex, setCurrentElementIndex] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);

    const audio = new Audio("./public/audio/part1.mp3");
    audio.addEventListener("loadedmetadata", () => {
        const durationInSeconds = audio.duration;
        audio.play();
    });


    useEffect(() => {

        // console.log("current page: " + currentPage + "| current element: " + currentElementIndex)


        const loadAudioDuration = () => {
            audio.addEventListener('loadedmetadata', () => {
                setAudioDuration(audio.duration);
            });
        };



        if (currentElementIndex < data[currentPage]["bulletPoints"].length + 1) {
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

    return (
        <div>
            <h2>{data[currentPage]?.title}</h2>
            <div>
                <ul>
                    {data[currentPage].bulletPoints
                        ?.slice(0, currentElementIndex)
                        .map((expression, index) => (
                            <li key={index}>{expression}</li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default LessonPage;