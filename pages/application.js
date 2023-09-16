import { useState } from "react";

export default function Application() {
    const [file, setFile] = useState(null);
    const [res, setRes] = useState("None");
    const [loading, setLoading] = useState(false);

    const openAICall = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/openAI", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    input: "1.1 Classical mechanics. Classical mechanics is a physical theory describing the motion of macroscopic objects, from projectiles to parts of machinery and astronomical objects, such as spacecraft, planets, stars, and galaxies. For objects governed by classical mechanics, if the present state is known, it is possible to predict how it will move in the future (determinism), and how it has moved in the past (reversibility).\n 1.2 Newtonian mechanics Newtonian mechanics is based on application of Newton's Laws of motion which assume that the concepts of distance, time, and mass, are absolute, that is, motion is in an inertial frame.\n.3 Lagrangian mechanics In physics, Lagrangian mechanics is a formulation of classical mechanics founded on the stationary-action principle (also known as the principle of least action). It was introduced by the Italian-French mathematician and astronomer Joseph-Louis Lagrange in his 1788 work, Mécanique analytique\n 1.4 Hamiltonian mechanics Hamiltonian mechanics has a close relationship with geometry (notably, symplectic geometry and Poisson structures) and serves as a link between classical and quantum mechanics.",
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
    };

    async function onSubmit(e) {
      e.preventDefault();
  
      if (!file) {
        setRes('Please upload a file');
        return;
      }
  
      setLoading(true);
  
      try {
        const formData = new FormData();
        formData.append('pdf', file);
  
        const response = await fetch('/api/uploadpdf', {
          method: 'POST',
          body: formData,
        });
  
        if (response.status === 200) {
          setRes('PDF uploaded and saved successfully');
        } else {
          throw new Error(`API call failed with status ${response.status}`);
        }
      } catch (err) {
        console.error(err);
        setRes(err.message);
      } finally {
        setLoading(false);
      }
  
      setFile(e.target.files?.[0])
      const formData = new FormData()
  
  
  
      try {
      //   if (!file) {
      //     throw new Error('Please upload a file')
      //   }
        setLoading(true)
  
        formData.append('pdf', file)
        console.log(formData)
        const response = await fetch('/api/pdfparse', {
          method: 'POST',
        });
        if (response.status === 200) {
          const data = await response.json();
          console.log('API response:', data);
          setText(data);
        } else {
          throw new Error(`API call failed with status ${response.status}`);
        }
        console.log("THIS IS THE TEXT:", data);
        setRes("Success")
        setLoading(false)
      }
      catch (err) {
        console.log(err)
        setRes(err.message)
      }
  
      console.log(text);
      try {
          const response = await fetch("/api/generate", {
              method: "POST",
              headers: {
              "Content-Type": "application/json",
              },
              body: JSON.stringify({ text: pdfText }),
          });
      
          const data = await response.json();
          if (response.status !== 200) {
              throw data.error || new Error(`Request failed with status ${response.status}`);
          }
      
          setResult(response);
          console.log("Your output is", result);
          console.log("hello");
          } catch(error) {
          // Consider implementing your own error handling logic here
          console.error(error);
          alert(error.message);
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
                                <button onClick={openAICall}>OpenAI</button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
