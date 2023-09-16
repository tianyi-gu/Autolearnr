import { useState } from "react";

export default function Application() {
    const [file, setFile] = useState(null);
    const [res, setRes] = useState("None");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(""); // Initialize data1 state

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
            console.log(formData);
            const response = await fetch("/api/pdfparse", {
                method: "POST",
            });
            if (response.status === 200) {
                dataRes = await response.json();
                //console.log("API response:", dataRes.txt);
                //setData(dataRes.txt);
            } else {
                throw new Error(
                    `API call failed with status ${response.status}`
                );
            }
            console.log("THIS IS THE TEXT:", dataRes.txt); 
            setRes("Success");
            setLoading(false);
        } catch (err) {
            console.log(err);
            setRes(err.message);
        }
        try {
            setLoading(true);
            console.log("BRRRRR", dataRes.txt); 
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
            console.log(data);
            setRes("Success");
            setLoading(false);
        } catch (err) {
            console.error(err);
            setRes(err.message);
            setLoading(false);
        }
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <div className="flex flex-col items-center gap-4">
                    {loading ? (
                        <div>loading</div>
                    ) : (
                        <>
                            <h1 className="text-6xl font-bold ">
                                PDF to video
                            </h1>
                            <p>Upload the pdf of a video file here</p>
                            <form
                                onSubmit={(e) => onSubmit(e)}
                                className="flex flex-col items-center gap-2"
                            >
                                <input
                                    type="file"
                                    name="file"
                                    onChange={(e) =>
                                        setFile(e.target.files?.[0])
                                    }
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
                        </>
                    )}
                </div>
            </div>
        </>
    );
}