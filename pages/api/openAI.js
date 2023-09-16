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
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are to be given texts of a lesson. Please summarize the file in a skeleton note in a markdown format in less than 50 words. No explanation is needed",
                    },
                    { role: "user", content: input },
                ],
            });
            const jsonString = JSON.stringify(response, null, 2);
            const filePath = "response.json";

            fs.writeFileSync(filePath, jsonString);
            res.status(200).json(response);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    } else {
        console.log("Received a non-POST request to /api/openAI");
        res.status(405).end();
    }
}
