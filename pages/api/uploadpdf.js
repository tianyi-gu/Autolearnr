import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
const formidable = require('formidable');

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  try {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(process.cwd(), 'uploads'); 

    form.parse(req, async (err, fields, files) => {
      if (err) {
        throw new Error('Form parsing error: ' + err.message);
      }

      console.log('Received files:', files);
      const pdfFile = files.pdf;

      if (!pdfFile) {
        throw new Error('PDF file not found in formData');
      }

      const uploadsFolder = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsFolder)) {
        fs.mkdirSync(uploadsFolder);
      }
      const uniqueFileName = `uploadedfile`;
      console.log('pdfFile:', pdfFile[0].filepath);
      fs.renameSync(pdfFile[0].filepath, path.join(uploadsFolder, uniqueFileName));
      res.status(200).json({ message: 'PDF uploaded and saved successfully' });
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred during processing' });
  }
}