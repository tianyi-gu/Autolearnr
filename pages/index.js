import { useState } from "react";

export default function Home() {
    const [file, setFile] = useState(null);
    const [res, setRes] = useState("None");
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("milk");
    const [script, setScript] = useState("");
    const [result, setResult] = useState("");

    const handleUpload = async () => {
        try {
            if (!file) {
                throw new Error("Please upload a file");
            }
            setLoading(true);
            const formData = new FormData();
            formData.append("pdf", file);
            const uploadResponse = await fetch("/api/uploadpdf", {
                method: "POST",
                body: formData,
            });
            if (uploadResponse.status !== 200) {
                throw new Error(
                    `API call failed with status ${uploadResponse.status}`
                );
            }
            const pdfParseResponse = await fetch("/api/pdfparse", {
                method: "POST",
            });
            if (pdfParseResponse.status !== 200) {
                throw new Error(
                    `API call to pdfparse failed with status ${pdfParseResponse.status}`
                );
            }
            const pdfParseData = await pdfParseResponse.json();
            const updatedText = pdfParseData.txt; 
            setText(updatedText); 

            const generateResponse = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ textInput: updatedText }), 
            });

            if (generateResponse.status !== 200) {
                throw new Error(
                    `API call to generate failed with status ${generateResponse.status}`
                );
            }

            const generateData = await generateResponse.json();
            setResult(generateData);
            const audioResponse = await fetch("/api/synthesizeAudio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ script: generateData, fileName: "output.mp3" }),
            });
            const audio = new Audio("/audio/output.mp3");
            audio.addEventListener("loadedmetadata", () => {
                const durationInSeconds = audio.duration;
                audio.play();
            });
            if (audioResponse.status === 200) {
                const audioData = await audioResponse.json();
                setResult("Audio generated successfully");
            } else {
                throw new Error(
                    `API call to synthesizeAudio failed with status ${audioResponse.status}`
                );
            }
            setRes("Success");
        } catch (error) {
            console.error(error);
            setRes(error.message);
        } finally {
            setLoading(false);
            console.log("Finished!")
        }
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <div className="flex flex-col items-center gap-4">
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            <h1 className="text-6xl font-bold">PDF Uploader</h1>
                            <p>Upload a PDF file here</p>
                            <form
                                onSubmit={(e) => e.preventDefault()}
                                encType="multipart/form-data"
                            >
                                <input
                                    type="file"
                                    name="pdf"
                                    accept=".pdf"
                                    onChange={(e) =>
                                        setFile(e.target.files?.[0])
                                    }
                                    className="border border-gray-300 rounded-md p-2 block"
                                />
                                <button
                                    onClick={handleUpload}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    type="button"
                                >
                                    Upload
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
