import { useEffect, useState } from 'react';

const SkeletonNotes = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentElementIndex, setCurrentElementIndex] = useState(0);

  useEffect(() => {
    const page = data[currentPage];

    const ulElement = page.xml.props.children.find((child) => child.type === 'ul');
    const listItems = ulElement.props.children.filter((child) => child.type === 'li');

    console.log("current page: " + currentPage + "|current element: " + currentElementIndex)

    if (currentElementIndex < listItems.length + 1) {
      // Display the next list item
      setTimeout(() => {
        setCurrentElementIndex((prevIndex) => prevIndex + 1);
      }, page.timestamp / listItems.length);
    } else {
      if(currentPage < data.length - 1){
        setCurrentElementIndex(0);
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  }, [currentPage, currentElementIndex, data]);

  return (
    <div>
      {data[currentPage]?.xml?.props?.children[0]?.props?.children && (
        <h2>{data[currentPage].xml.props.children[0].props.children}</h2>
      )}
      <div>
        <ul>
          {data[currentPage]?.xml?.props?.children[1]?.props?.children
            ?.slice(0, currentElementIndex)
            .map((li, index) => (
              <li key={index}>{li.props.children}</li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default SkeletonNotes;
