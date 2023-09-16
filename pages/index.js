import { data } from 'browserslist';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState('None');
  const [loading, setLoading] = useState(false);
    const [text, setText] = useState("");
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
      <div className='flex flex-col items-center justify-center min-h-screen py-2'>
        <div className='flex flex-col items-center gap-4 '>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <h1 className='text-6xl font-bold'>PDF Uploader</h1>
              <p>Upload a PDF file here</p>
              <form onSubmit={(e) => onSubmit(e)} encType='multipart/form-data'>
                <input
                  type='file'
                  name='pdf'
                  accept='.pdf'
                  onChange={(e) => setFile(e.target.files?.[0])}
                  className='border border-gray-300 rounded-md p-2 block'
                />
                <p>Result: {res}</p>
                <button
                  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                  type='submit'
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

// import button from '../components/ui/button'
// import { useState } from 'react'
// import fetch from 'node-fetch';

// export default function Home() {
//   const [file, setFile] = useState(null)
//   const [res, setRes] = useState("None")
//   const [loading, setLoading] = useState(false)
//   const [result, setResult] = useState();
// const [pdfText, setPdfText] = useState(" testing ");

// async function onSubmit(e) {
//     e.preventDefault()
//     setFile(e.target.files?.[0])
//     const formData = new FormData()
    // try {
    // //   if (!file) {
    // //     throw new Error('Please upload a file')
    // //   }
    //   setLoading(true)

    //   formData.append('pdf', file)
    //   console.log(formData)
    //   const response = await fetch('/api/pdfparse', {
    //     method: 'POST',
    //   });
    //   if (response.status === 200) {
    //     const data = await response.json();
    //     console.log('API response:', data);
    //   } else {
    //     throw new Error(`API call failed with status ${response.status}`);
    //   }
    //   setRes("Success")
    //   setLoading(false)
    // }
    // catch (err) {
    //   console.log(err)
    //   setRes(err.message)
//     }
//     console.log("testing");


//     // try {
//     //     // Make a GET request to the 'api/generate' endpoint
//     //     const response = await fetch('http://localhost:3000/api/pdfparse', {
//     //       method: 'GET', // Change to 'POST' if necessary
//     //       headers: {
//     //         'Content-Type': 'application/json',
//     //       },
//     //       // Add any request body data if needed
//     //       body: JSON.stringify({ file }),
//     //     });
    
//     //     // Check if the response status is OK (200)
//     //     if (response.status === 200) {
//     //       const data = await response.json();
//     //       console.log('Response from /api/generate:', data);
//     //     } else {
//     //       console.error('Error:', response.statusText);
//     //     }
//     //   } catch (error) {
//     //     console.error('API call error:', error);
//     //   }

//     try {
//         const response = await fetch("/api/generate", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ text: pdfText }),
//         });
  
//         const data = await response.json();
//         if (response.status !== 200) {
//           throw data.error || new Error(`Request failed with status ${response.status}`);
//         }
  
//         setResult(response);
//         console.log("Your output is", result);
//         console.log("hello");
//       } catch(error) {
//         // Consider implementing your own error handling logic here
//         console.error(error);
//         alert(error.message);
//       }
//   }

//   return (
//     <>
//       <div className='flex flex-col items-center justify-center min-h-screen py-2'>
//         <div className='flex flex-col items-center gap-4 '>
//           {loading ? (
//             <div>loading</div>
//           ) : ( 
//           <>
//           <h1 className='text-6xl font-bold '>PDF to video</h1>
//           <p >Upload the pdf of a video file here</p>
//           <form onSubmit={(e) => onSubmit(e)} encType="multipart/form-data">
//             <input
//               type="file"
//               name="pdf"
//               accept=".pdf"
//               onChange={((e) => setFile(e.target.files?.[0]), console.log("submitted!"))}
//               className="border border-gray-300 rounded-md p-2 block"
//             />
//             <p>Result: {res}</p>
//           <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type='submit'>
//             Upload
//           </button>
//           </form>
//           </>
//           ) }
//         </div>
//       </div>
//     </>
//   )
// }

