// pages/api/upload-pdf.ts
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
  const txt = await readPDF("pages/api/phil101.pdf")
  console.log(txt);

  res.status(200).json({"message": "good"})
}
