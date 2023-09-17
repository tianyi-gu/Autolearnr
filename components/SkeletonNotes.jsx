import { useEffect, useState } from 'react';

const SkeletonNotes = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [audio] = useState(new Audio()); // Create an audio element
  const [audioDuration, setAudioDuration] = useState(0);


  useEffect(() => {

    // console.log("current page: " + currentPage + "| current element: " + currentElementIndex)

    // const playAudioForCurrentSlide = () => {
    //   const audioFile = data[currentPage]?.name + ".mp3"; // Assuming you have an "audio" property in your data
    //   if (audioFile) {
    //     audio.src = audioFile;
    //     audio.play();
    //   }
    // };

    // const loadAudioDuration = () => {
    //   audio.addEventListener('loadedmetadata', () => {
    //     setAudioDuration(audio.duration);
    //   });
    // };

    // // Load audio duration when the component mounts or audio file changes
    // loadAudioDuration();

    if (currentElementIndex < data[currentPage]["bulletPoints"].length + 1) {
      setTimeout(() => {
        setCurrentElementIndex((prevIndex) => prevIndex + 1);
        // playAudioForCurrentSlide(); // Play audio for the current slide
      }, 1000);
    } else {
      if(currentPage < data.length - 1){
        setCurrentElementIndex(0);
        setCurrentPage((prevPage) => prevPage + 1);
        // playAudioForCurrentSlide();
      }
    }
    // return () => {
    //   audio.removeEventListener('loadedmetadata', () => {
    //     setAudioDuration(audio.duration);
    //   });
    // };
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

export default SkeletonNotes;