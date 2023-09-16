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
            const { input } = req.body;
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo-16k",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are to be given texts of a lesson. Please summarize the file in HTML with each main point contained within its own div with a title as h2 and a following list of bullet points regarding that main point with sublevels. No explanation is needed. Then can you divide everything up into a JSON array based on each main point thanks man",
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
                const mainPoint = `<div><h2>${title}</h2>${content}</div>`.replace(/\n/g, ""); // Remove newlines
                mainPoints.push(mainPoint);
            }

            const jsonArray = JSON.stringify(mainPoints);

            // Write the JSON array to a JSON file
            const jsonFilePath = "skeletonNotes.json";
            fs.writeFileSync(jsonFilePath, jsonArray, "utf-8");

            res.status(200).json(jsonArray);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    } else {
        console.log("Received a non-POST request to /api/openAI");
        res.status(405).end();
    }
}
