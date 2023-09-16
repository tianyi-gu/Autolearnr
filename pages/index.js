import button from '../components/ui/button'
import { useState } from 'react'

export default function Home() {
  const [file, setFile] = useState(null)
  const [res, setRes] = useState("None")
  const [loading, setLoading] = useState(false)
  
  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    try {
      if (!file) {
        throw new Error('Please upload a file')
      }
      setLoading(true)

      formData.append('file', file)
      console.log(formData)

      setRes("Success")
      setLoading(false)
    }
    catch (err) {
      console.log(err)
      setRes(err.message)
    }
    try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ animal: animalInput, color: colorInput }),
        });
  
        const data = await response.json();
        if (response.status !== 200) {
          throw data.error || new Error(`Request failed with status ${response.status}`);
        }
  
        setResult(data.result);
        setAnimalInput("");
        setColorInput("");
        console.log('hello');
      } catch(error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
      }
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <div className='flex flex-col items-center gap-4 '>
          {loading ? (
            <div>loading</div>
          ) : ( 
          <>
          <h1 className='text-6xl font-bold '>PDF to video</h1>
          <p >Upload the pdf of a video file here</p>
          <form onSubmit={(e) => onSubmit(e)}>
            <input
              type="file"
              name="file"
              onChange={((e) => setFile(e.target.files?.[0]), console.log("submitted!"))}
              className="border border-gray-300 rounded-md p-2 block"
            />
            <p>Result: {res}</p>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type='submit'>
            Upload
          </button>
          </form>
          </>
          ) }
        </div>
      </div>
    </>
  )
}

