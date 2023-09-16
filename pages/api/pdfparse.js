const { readFileSync } = require("fs");
const PDFParser = require("pdf-parse");

async function readPDF(pdfPath) {
    return new Promise(async (resolve, reject) => {
        try {
            const dataBuffer = readFileSync(pdfPath);
            const data = await PDFParser(dataBuffer);
            resolve(data.text);
        } catch (error) {
            reject(error);
        }
    });
}

export default async function handler(req, res) {
    try {
        console.log("entered");
        const txt = await readPDF("uploads/uploadedfile");
        console.log(txt);
        res.status(200).json({ txt });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while processing the PDF." });
    }
}
