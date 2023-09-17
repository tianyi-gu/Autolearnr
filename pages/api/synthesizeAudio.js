import { TextToSpeechClient } from "@google-cloud/text-to-speech/build/src/v1beta1";
import fs from "fs";
import util from "util";

export default async function handler(req, res) {
    //console.log("test");
    if (req.method === "POST") {
        try {
            const { script, fileName } = req.body;
            const client = new TextToSpeechClient();
            //console.log(fileName);
            const outputFile = `./public/audio/${fileName}.mp3`;
            const request = {
                input: {
                    text: script,
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
            //console.log("alright alright alright");
            res.status(200).send("Audio generated successfully.");
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).send("Internal Server Error");
        }
    } else {
        res.status(405).end();
    }
}
