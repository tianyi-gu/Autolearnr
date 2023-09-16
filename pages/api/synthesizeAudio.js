import { TextToSpeechClient } from "@google-cloud/text-to-speech/build/src/v1beta1";
import fs from "fs";
import util from "util";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { ssmlText } = req.body;
            const client = new TextToSpeechClient();
            const outputFile = "./public/audio/output.mp3";
            const request = {
                input: {
                    ssml: ssmlText,
                },
                voice: { languageCode: "en-US", ssmlGender: "FEMALE" },
                audioConfig: { audioEncoding: "MP3" },
                enableTimePointing: ["SSML_MARK"],
            };
            const [response] = await client.synthesizeSpeech(request);
            const timepoints = response.timepoints;
            const timepointsFile = "./public/json/timepoints.json";
            const writeFile = util.promisify(fs.writeFile);
            await writeFile(timepointsFile, JSON.stringify(timepoints, null, 2), "utf-8");
            console.log(`Timepoints written to file: ${timepointsFile}`);
            await writeFile(outputFile, response.audioContent, "binary");
            console.log(`Audio content written to file: ${outputFile}`);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    } else {
        console.log("Received a non-POST request to /api/synthesizeAudio");
        res.status(405).end();
    }
}
