// import { NextApiRequest, NextApiResponse } from 'next';
// import fs from 'fs';
// import PDFParser from 'pdf-parse';


// const formidable = require('formidable');
// export const config = {
//   api: {
//     bodyParser: false, // Disable default body parsing
//   },
// };

// async function readPDF(pdfData) {
//   const dataBuffer = Buffer.from(pdfData);

//   const data = await PDFParser(dataBuffer);

//   return data.text;
// }

// export default async function handler(req, res) {
//   try {
//     const form = new formidable.IncomingForm();

//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         throw new Error('Form parsing error: ' + err.message);
//       }

//       console.log('Received files:', files);
//       const pdfFile = files.pdf;

//       if (!pdfFile) {
//         throw new Error('PDF file not found in formData');
//       }

//       const pdfData = fs.readFileSync(pdfFile.path);
//       const txt = await readPDF(pdfData);
//       console.log(txt);

//       res.status(200).json({ message: 'PDF processed successfully' });
//     });
//   } catch (error) {
//     console.error('Error:', error.message);
//     res.status(500).json({ error: 'An error occurred during processing' });
//   }
// }


// import { NextApiRequest, NextApiResponse } from 'next';
// import {IncomingForm} from "formidable"; 

// const formidable = require("formidable");
// async function readPDF(pdfPath) {
//   const fs = require('fs');
//   const PDFParser = require('pdf-parse');

//   const dataBuffer = fs.readFileSync(pdfPath);
//   const data = await PDFParser(dataBuffer);

//   return data.text;
// }

// export const config = {
//   api: {
//     bodyParser: false, // Disable default body parsing
//   },
// };

// export default async function handler(req, res) {
//   try {
//     // Create a new formidable form parser
//     const form = new formidable.IncomingForm();

//     // Parse the incoming formData
//     form.parse(req, async (err, fields, files) => {
//       if (err) {
//         throw new Error('Form parsing error: ' + err.message);
//       }

//       console.log('Received formData:', fields); // Log fields for debugging
//       console.log('Received files:', files);
//       // Get the PDF file from the 'pdf' field in formData
//       const pdfFile = files.pdf;
//       if (!pdfFile) {
//         throw new Error('PDF file not found in formData');
//       }
//       // Process the PDF file (you can use pdfFile.path to access the file path)
//       const txt = await readPDF(pdfFile.path);
//       console.log(txt);

//       // Respond with a success message
//       res.status(200).json({ message: 'PDF processed successfully' });
//     });
//   } catch (error) {
//     console.error('Error:', error.message);
//     res.status(500).json({ error: 'An error occurred during processing' });
//   }
// }

import { NextApiRequest, NextApiResponse } from 'next';

async function readPDF(pdfPath) {
    const fs = require('fs');
    const PDFParser = require('pdf-parse');

    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await PDFParser(dataBuffer);

    return data.text;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const txt = await readPDF("uploads/uploadedfile")
    // console.log(txt);
    
    res.status(200).json({txt})
}
