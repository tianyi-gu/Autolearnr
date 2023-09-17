import SkeletonNotes from '../components/SkeletonNotes';
import skeletonData from '../skeletonData.json';
import { useEffect, useState } from "react";


const LessonPage = () => {
    // console.log(skeletonData)
    return (
        <div>
            <SkeletonNotes data={skeletonData} />
        </div>
    );
};

export default LessonPage;