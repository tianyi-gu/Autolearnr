import { useEffect, useState } from 'react';

const SkeletonNotes = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);

  useEffect(() => {

    // console.log("current page: " + currentPage + "| current element: " + currentElementIndex)

    if (currentElementIndex < data[currentPage]["bulletPoints"].length + 1) {
      setTimeout(() => {
        setCurrentElementIndex((prevIndex) => prevIndex + 1);
      }, 1000);
    } else {
      if(currentPage < data.length - 1){
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

export default SkeletonNotes;