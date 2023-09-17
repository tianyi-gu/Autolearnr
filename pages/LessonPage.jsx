import SkeletonNotes from '../components/SkeletonNotes';
import skeletonData from '../skeletonData.json';
import { useEffect, useState } from "react";


const LessonPage = () => {
    return (
        <div>
            <SkeletonNotes data={skeletonData} />
        </div>
    );
};

export default LessonPage;