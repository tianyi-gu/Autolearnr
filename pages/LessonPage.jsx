import SkeletonNotes from '../components/SkeletonNotes';

const LessonPage = () => {
    // Replace with your parsed Markdown data
    const skeletonData = [
        {
            timestamp: 3000,
            xml: <>
                <h1>Chapter 1: Introduction to Fluid Dynamics</h1>
                <ul>
                    <li>Fluid dynamics is the study of movement of fluids</li>
                    <li>Fluid dynamics is hard</li>
                    <li>Pascal's equation evaluates the work done</li>
                    <li>Pascal's equation evaluates the external height</li>
                </ul>
            </>
        }, {
            timestamp: 4000,
            xml: <>
                <h1>Chapter 2: Pascal's Equation</h1>
                <ul>
                    <li>Pascal's equation talks about something fun</li>
                    <li>Pascal's equation evaluates the presure</li>
                    <li>Pascal's equation evaluates the dslfkdfjk</li>
                </ul>
            </>
        },
        {
            timestamp: 6000,
            xml: <>
                <h1>Chapter 3: Pascal's REAL Equation</h1 >
                <ul>
                    <li>Pascal's equation talks about something fun</li>
                    <li>Pascal's equation evaluates the presure</li>
                </ul>
            </>
        }
    ];

    return (
        <div>
            <h1>Lesson</h1>
            <SkeletonNotes data={skeletonData} />
        </div>
    );
};

export default LessonPage;