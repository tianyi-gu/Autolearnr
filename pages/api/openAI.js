import OpenAI from "openai";
import dotenv from "dotenv";

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
                model: "gpt-4",
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
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are to be given texts of a lesson. Please return an array of <div>'s, with each entry representing a main point in the text.\
              Each entry should contain one <h2> tag representing the title of the main point, and a <ul> containing <li>'s representing subpoints within the text. Each array should be a string",
                    },
                    { role: "user", content: input },
                ],
            });

            const responseText = response.choices[0].message.content;

            // Extract main points from HTML and wrap them in div containers with h2 titles
            const mainPointsRegex = /<h2>(.*?)<\/h2>(.*?)<\/div>/gs;
            const mainPoints = [];
            let match;

            while ((match = mainPointsRegex.exec(responseText))) {
                const title = match[1].trim();
                const content = match[2].trim();
                const mainPoint =
                    `<div><h2>${title}</h2>${content}</div>`.replace(/\n/g, "");
                // Remove newlines
                mainPoints.push(mainPoint);
            }

            const numberOfPoints = mainPoints.length;
            console.log(mainPoints);
            console.log("points: " + numberOfPoints);
            const mainPointsString = mainPoints.reduce((acc, curr, index) => {
                return acc + `${index + 1}. ${curr}`;
            }, "");
            //console.log(mainPointsString);

            // Split script into chunks based on main points
            response = await openai.chat.completions.create({
                temperature: 0,
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `We are trying to seperate a script for narration of a slideshow compoesd of several main points. Here, each main point corresponds to one slide. Split a script for a video into ${numberOfPoints} parts, each corrisponding to one slide and thus one main point in the slideshow. These parts are to be read, so do not give structured output of any kind and keep the spontanity of the speech. Here are the ${numberOfPoints} main points that corelate to each part of the script, each given in html format: ${mainPointsString}. Output a JSON array of all the parts.`
                    },
                    {
                        role: "user",
                        content: "The following is the user script to be used for the slideshow: " + script,
                    },
                ],
            });

            //splitScript is the final script that is split into parts
            const splitScriptArray = JSON.parse(response.choices[0].message.content)
            console.log(splitScriptArray)
            let audioChunks = [];
            for (let i = 0; i < splitScriptArray.length; i++) {
                audioChunks.push({
                    name: `part${i + 1}`,
                    points: mainPoints[i],
                    script: splitScriptArray[i],
                });
            }
            //TODO: generate openAI embeddings from input text
            

            const data = {audioChunks, embeddings}
            const dataJson = JSON.stringify(data);

            //console.log(dataJson);

            // Write the JSON array to a JSON file
            const jsonFilePath = "skeletonNotes.json";
            fs.writeFileSync(jsonFilePath, dataJson, "utf-8");
            // console.log(data);
            // console.log(splitScriptArray);
            response = await openai.chat.completions.create({
                temperature: 0,
                model: "gpt-4",
                temperature: 0,
                messages: [
                    {
                        role: "system",
                        content: `You will be given a string array generate a multiple-choice question based on each string element in a string array (VERY VERY VERY IMPORTANT: THERE MUST BE ONE QUESTION PER ELEMENT unless the element is a empty string).\n Each question should be formatted as an object in a JSON array with the following properties: "question," "choices," and "answer." The "answer" should vary from "A" to "D" and the answer MUST BE ACCURATE. Each question should have four answer choices (A, B, C, D) (The string in choices should be in the format of "A. ----" or "B. ----" ) Answers should just have one character that is from A to D`,
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
