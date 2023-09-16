import { useState } from "react";

export default function Application() {
    const [file, setFile] = useState(null);
    const [res, setRes] = useState("None");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState("");

    async function onSubmit(e) {
        e.preventDefault();

        if (!file) {
            setRes("Please upload a file");
            return;
        }
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("pdf", file);

            const response = await fetch("/api/uploadpdf", {
                method: "POST",
                body: formData,
            });

            if (response.status === 200) {
                setRes("PDF uploaded and saved successfully");
            } else {
                throw new Error(
                    `API call failed with status ${response.status}`
                );
            }
        } catch (err) {
            console.error(err);
            setRes(err.message);
        } finally {
            setLoading(false);
        }

        setFile(e.target.files?.[0]);
        const formData = new FormData();
        let dataRes;
        try {
            setLoading(true);

            formData.append("pdf", file);
            const response = await fetch("/api/pdfparse", {
                method: "POST",
            });
            if (response.status === 200) {
                dataRes = await response.json();
            } else {
                throw new Error(
                    `API call failed with status ${response.status}`
                );
            }
            setRes("Success");
            setLoading(false);
        } catch (err) {
            setRes(err.message);
        }
        try {
            setLoading(true);
            const response = await fetch("/api/openAI", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    input: dataRes.txt,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch data from OpenAI");
            }

            const data = await response.json();
            let count = 0;
            for (var obj in data) {
                if (data.hasOwnProperty(obj)) {
                    // Check if obj is a valid property
                    const script = data[obj].script;
                    console.log(script); // Access script property
                    if (script) {
                        // Check if script is not undefined
                        const audioResponse = await fetch(
                            "/api/synthesizeAudio",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    script: script, 
                                    fileName: `part${count}.mp3`,
                                }),
                            }
                        );
                        count++;
                    } else {
                        console.error(
                            "Script is undefined or null for object:",
                            obj
                        );
                    }
                }
            }

            setRes("Success");
            setLoading(false);
        } catch (err) {
            console.error(err);
            setRes(err.message);
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 gap-4">
            {loading ? (
                <div>loading</div>
            ) : (
                <div>
                    <h1 className="text-6xl font-bold ">PDF to video</h1>
                    <p>Upload the pdf of a video file here</p>
                    <form
                        onSubmit={(e) => onSubmit(e)}
                        className="flex flex-col items-center gap-2"
                    >
                        <input
                            type="file"
                            name="file"
                            onChange={(e) => setFile(e.target.files?.[0])}
                            className="border border-gray-300 rounded-md p-2 block"
                        />
                        <p>Result: {res}</p>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            type="submit"
                        >
                            Upload
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
