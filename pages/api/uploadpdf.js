import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
const formidable = require('formidable');

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

export default async function handler(req, res) {
  try {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), 'uploads'); // Define the upload directory

    form.parse(req, async (err, fields, files) => {
      if (err) {
        throw new Error('Form parsing error: ' + err.message);
      }

      console.log('Received files:', files);
      const pdfFile = files.pdf;

      if (!pdfFile) {
        throw new Error('PDF file not found in formData');
      }

      // Create the uploads folder if it doesn't exist
      const uploadsFolder = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsFolder)) {
        fs.mkdirSync(uploadsFolder);
      }

      // Generate a unique filename (you can use any method you prefer)
    //   const uniqueFileName = `${Date.now()}_${pdfFile.name}`;
      const uniqueFileName = `uploadedfile`;
      console.log('pdfFile:', pdfFile[0].filepath);
      // Move the uploaded file to the uploads folder with the unique filename
      fs.renameSync(pdfFile[0].filepath, path.join(uploadsFolder, uniqueFileName));

      res.status(200).json({ message: 'PDF uploaded and saved successfully' });
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred during processing' });
  }
}
