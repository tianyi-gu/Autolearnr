import { TextToSpeechClient } from "@google-cloud/text-to-speech/build/src/v1beta1";
import fs from "fs";
import util from "util";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { script } = req.body;
            const client = new TextToSpeechClient();
            console.log("yo");
            console.log(script.response);
            console.log(script);
            const outputFile = "./public/audio/output.mp3";
            const request = {
                input: {
                    text: script.response.replace(/\[.*?\]/g, "").replace(/.*?:/g, ""),
                },
                voice: {
                    languageCode: "en-US",
                    voiceName: "en-US-Polyglot-1",
                    ssmlGender: "MALE",
                },
                audioConfig: { audioEncoding: "MP3" },
            };
            const [response] = await client.synthesizeSpeech(request);
            const writeFile = util.promisify(fs.writeFile);
            await writeFile(outputFile, response.audioContent, "binary");
            console.log(`Audio content written to file: ${outputFile}`);
            res.status(200).send("Audio generated successfully.");
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).send("Internal Server Error");
        }
    } else {
        console.log("Received a non-POST request to /api/synthesizeAudio");
        res.status(405).end();
    }
}
