import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { textInput: input } = req.body;

            //Script Generation
            const chatCompletion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-16k",
                temperature: 1.2,
                messages: [
                    {
                        role: "system",
                        content: `You are to receive texts used to teach a class. You are to teach generate a continuous texts that would be passed into a Text-To-Speech function to teach the class on the topic. Generate spoken texts ONLY, no explanations, headers, or cues.`,
                    },
                    {
                        role: "user",
                        content: input,
                    },
                ],
            });

            const script = chatCompletion.choices[0].message.content;
            let response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-16k",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are to be given texts of a lesson. Please return a JSON array of objects with a 'title' property that represents the main point in the text. Each entry should also have a 'bulletPoints' property, which is an array of strings representing subpoints within the text.",
                    },
                    { role: "user", content: input },
                ],
            });
            
            const responseJSON = JSON.parse(response.choices[0].message.content);
            
            // Process the JSON data directly
            const titles = responseJSON.map((entry) => entry.title);
            const bulletPoints = responseJSON.map((entry) => entry.bulletPoints);
            
            console.log("Titles:", titles);
            console.log("Bullet Points:", bulletPoints);            

            // Split script into chunks based on main points
            response = await openai.chat.completions.create({
                temperature: 0,
                model: "gpt-3.5-turbo-16k",
                messages: [
                    {
                        role: "system",
                        content: `We are trying to seperate a script for narration of a slideshow compoesd of several main points. Here, each main point corresponds to one slide. Split a script for a video into ${responseJSON.length} parts, each corrisponding to one slide and thus one main point in the slideshow. These parts are to be read, so do not give structured output of any kind and keep the spontanity of the speech. Here are the ${responseJSON.length} main points that corelate to each part of the script, each given in html format: ${titles}. Output a JSON array of all the parts.`,
                    },
                    {
                        role: "user",
                        content:
                            script,
                    },
                ],
            });

            //splitScript is the final script that is split into parts
            const splitScriptArray = JSON.parse(
                response.choices[0].message.content
            );
            let data = [];
            for (let i = 0; i < splitScriptArray.length; i++) {
                data.push({
                    name: `part${i + 1}`,
                    title: titles[i],
                    bulletPoint: bulletPoints[i],
                    script: splitScriptArray[i],
                });
            }
            const dataJson = JSON.stringify(data);

            // Write the JSON array to a JSON file
            const jsonFilePath = "skeletonNotes.json";
            fs.writeFileSync(jsonFilePath, dataJson, "utf-8");
            response = await openai.chat.completions.create({
                temperature: 0,
                model: "gpt-3.5-turbo-16k",
                temperature: 0,
                messages: [
                    {
                        role: "system",
                        content: `You will be given a string array to generate a multiple-choice question based on each string element script in a string array.(VERY VERY VERY IMPORTANT: THERE MUST BE ONE QUESTION PER MAIN POINT).\n Each question should be formatted as an object in a JSON array with the following properties: "question," "choices" choices is an object array with a length of 4 and question is a string the answer MUST BE ACCURATE.  (The string in choices should be in the format of {answerText:"A. ----", isCorrect: boolean depending on whether it is the answer} or {answerText"B. ----", isCorrect: boolean depending on whether it is the answer}.... all the way to D.--- (NOTE: make the position of the correct answer randomized so that the correct answer's index is different))`,
                    },
                    { role: "user", content: `${splitScriptArray}` },
                ],
            });
            //console.log(response);
            const responseContent = response.choices[0].message.content;
            const responseObject = JSON.parse(responseContent);
            const outputPath = "question.json";
            fs.writeFileSync(
                outputPath,
                JSON.stringify(responseObject, null, 2)
            );
            res.status(200).json(dataJson);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    } else {
        res.status(405).end();
    }
}
