import React, { useState, useEffect } from "react";
import skeletonData from "../skeletonData.json";
import { useRouter } from "next/router";
import AudioPlayer from "./AudioPlayer";
import dynamic from "next/dynamic";
import Modal from "../components/Modal";
import { Button } from "components/ui/button";
import { PencilOutline, CloseOutline } from "react-ionicons";
import ChatWidget from "../components/ChatWidget";

const DynamicParticlesBg = dynamic(() => import("particles-bg"), {
    ssr: false,
});

export default function LessonPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const data = skeletonData;
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const [currentElementIndex, setCurrentElementIndex] = useState(0);
    const [audioPath, setAudioPath] = useState(`/audio/${data[0].name}.mp3`);
    const [audioDuration, setAudioDuration] = useState(null);
    const [needNewAudio, setNeedNewAudio] = useState(true);

    const handleAudioDuration = (duration) => {
        if (audioDuration === null) {
            setAudioDuration(duration);
        }
        setNeedNewAudio(false);
        console.log(duration);
    };

    useEffect(() => {
        if (audioDuration !== null) {
            console.log("interval started!");
            if (currentElementIndex < data[currentPage].bulletPoint.length) {
                setNeedNewAudio(false);

                // Automatically advance to the next element when the element duration elapses
                const intervalId = setTimeout(() => {
                    setCurrentElementIndex((prevIndex) => prevIndex + 1);
                }, (audioDuration * 1000) / data[currentPage].bulletPoint.length);

                // Clean up the interval when the component unmounts or when the element changes
                return () => {
                    clearTimeout(intervalId);
                };
            } else {
                // If all elements have been displayed, move to the next page
                if (currentPage < data.length - 1) {
                    setTimeout(() => {
                        setAudioPath(
                            `/audio/${data[currentPage + 1].name}.mp3`
                        );
                        setCurrentElementIndex(0);
                        setCurrentPage((prevPage) => prevPage + 1);
                        setAudioDuration(null); // Reset audio duration for the new audio
                        setNeedNewAudio(true);
                    }, (audioDuration * 1000) / (data[currentPage].bulletPoint.length + 1));
                } else {
                    // Check if all bullet points are completed
                    const allBulletPointsCompleted = data[
                        currentPage
                    ].bulletPoint.every((bullet) => bullet.completed);

                    if (allBulletPointsCompleted) {
                        // Redirect to /application when all bullet points are completed
                        useEffect(() => {
    if (audioDuration !== null) {
        console.log("interval started!")
        if (currentElementIndex < data[currentPage].bulletPoint.length) {
            setNeedNewAudio(false);

            // Automatically advance to the next element when the element duration elapses
            const intervalId = setTimeout(() => {
                setCurrentElementIndex((prevIndex) => prevIndex + 1);
            }, audioDuration * 1000 / (data[currentPage].bulletPoint.length));

            // Clean up the interval when the component unmounts or when the element changes
            return () => {
                clearTimeout(intervalId);
            };
        } else {
            // If all elements have been displayed, move to the next page
            if (currentPage < data.length - 1) {
                setTimeout(() => {
                    setAudioPath(`/audio/${data[currentPage + 1].name}.mp3`);
                    setCurrentElementIndex(0);
                    setCurrentPage((prevPage) => prevPage + 1);
                    setAudioDuration(null); // Reset audio duration for the new audio
                    setNeedNewAudio(true);
                }, audioDuration * 1000 / (data[currentPage].bulletPoint.length + 1));
            } else {
                // Check if all bullet points are completed
                const allBulletPointsCompleted = data[currentPage].bulletPoint.every(bullet => bullet.completed);

                if (allBulletPointsCompleted) {
                    router.push("/application")
                }
            }
        }
    }
}, [currentPage, currentElementIndex, data, needNewAudio]);

                    }
                }
            }
        }
    }, [currentPage, currentElementIndex, data, needNewAudio]);

    console.log("Page Number:", currentPage);
    console.log("Page Duration:", audioDuration);

    const listItemStyle ={
        marginBottom: "25px",
        fontFamily: "Times New Roman",
    };
    const modalStyle = {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        backgroundColor: "white",
        border: "2 px solid black",
        color: "black",
        cursor: "pointer",
        position: "fixed",
        bottom: "45px",
        left: "45px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };
    const backButtonStyle = {
        position: "absolute",
        top: "20px",
        right: "20px",
        cursor: "pointer",
        fontSize: "35px",
      };
      const goBack = () => {
        router.push("/");
      };
    
    return (
        <div style={{ textAlign: "center", padding: "20px"}}>
            <h2 style={{ fontSize: "36px" }}>
                <b>Generated Notes</b>
            </h2>
            <h2 style={{ fontSize: "24px" }}>
                <b style={{ fontFamily: "Times New Roman"}}>{data[currentPage]?.title}</b>
            </h2>
            <div>
                <ul>
                    {data[currentPage].bulletPoint
                        ?.slice(0, currentElementIndex)
                        .map((expression, index) => (
                            <li key={index} style={listItemStyle}>{expression}</li>
                        ))}
                </ul>
            </div>
            {needNewAudio && (
                <AudioPlayer
                    src={audioPath}
                    play={needNewAudio}
                    parentCallback={handleAudioDuration}
                    style={{ marginTop: "20px"}}
                />
            )}
            <DynamicParticlesBg type="square" bg = {true}/>
            <span style={backButtonStyle} onClick={goBack}>
                &#8592;
            </span>
            <Button
                        style={modalStyle}
                        onClick={() => {
                            setModalOpen(true);
                        }}
                    >
                        <PencilOutline
                            color={"#00000"}
                            title={""}
                            height="40px"
                            width="40px"
                        />
                    </Button>
                    <ChatWidget style={modalStyle} />

                    {modalOpen && <Modal setOpenModal={setModalOpen} />}
        </div>
    );
}
