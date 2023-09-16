import button from '../components/ui/button'
import { useState } from 'react'

export default function Home() {
  const [file, setFile] = useState(null)
  const [res, setRes] = useState("None")
  const [loading, setLoading] = useState(false)
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setFile(e.target.files?.[0])
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
              onChange={(e) => setFile(e.target.files?.[0])}
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

