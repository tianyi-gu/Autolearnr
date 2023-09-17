import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "components/ui/button";

const DynamicParticlesBg = dynamic(() => import("particles-bg"), {
  ssr: false, // Set this to false to only render on the client side
});

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

            const generateResponse = await fetch("/api/openAI", {
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
        body: JSON.stringify({
          script: generateData,
          fileName: "output.mp3",
        }),
      });
      const audio = new Audio("/audio/output.mp3");
      audio.addEventListener("loadedmetadata", () => {
        const durationInSeconds = audio.duration;
        audio.play();
      });
      setRes("Success");
    } catch (error) {
      console.error(error);
      setRes(error.message);
    } finally {
      setLoading(false);
      console.log("Finished!");
    }
  };

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    minHeight: "100vh",
    padding: "1rem",
    marginTop: "1rem",
    textAlign: "center", // Center the text and content
  };

  const headingStyle = {
    fontSize: "6rem",
    paddingBottom: "2rem",
  };

  const inputStyle = {
    border: "2px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "1rem",
  };

  const buttonStyle = {
    fontSize: "1.5rem",
    padding: "10px 20px",
    backgroundColor: "transparent",
    color: "#000",
    border: "2px solid #000",
    borderRadius: "25px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    marginTop: "1rem",
  };

  const buttonHoverStyle = {
    backgroundColor: "#000",
    color: "#fff",
  };

  return (
    <div style={containerStyle}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1 style={headingStyle} className="text-6xl font-bold">
            <i>Learn to master.</i>
          </h1>
          <form
            onSubmit={(e) => e.preventDefault()}
            encType="multipart/form-data"
          >
            <input
              style={inputStyle}
              type="file"
              name="pdf"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0])}
            />
          </form>
          <Button
            onClick={handleUpload}
            style={buttonStyle}
            onMouseEnter={(e) => e.target.classList.add("hovered")}
            onMouseLeave={(e) => e.target.classList.remove("hovered")}
          >
            Upload
          </Button>
          <DynamicParticlesBg type="square" bg={true} />
          <style jsx global>
            {`
              .hovered {
                background-color: #0050c8 !important;
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
}