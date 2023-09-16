import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import { Console } from "console";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { input } = req.body;

      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `Generate a script for a Khan Academy-like educational video on the following content. Only include text that the host would say, in a speech-like format by only including text that would be spoken.`,
          },
          {
            role: "user",
            content: input
          }
        ],
      });

      const script = chatCompletion.choices[0].message.content;
      console.log(script);

      let response = await openai.chat.completions.create({
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
        const mainPoint = `<div><h2>${title}</h2>${content}</div>`.replace(
          /\n/g,
          ""
        ); // Remove newlines
        mainPoints.push(mainPoint);
      }

      const numberOfPoints = mainPoints.length;
      console.log(numberOfPoints);

      const mainPointsString = mainPoints.reduce((acc, curr, index) => {
        return acc + `${index + 1}. ${curr} `;
      }, "");
      console.log(mainPointsString);

      response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: [
          {
            role: "system",
            content: `Split user scripts for a video into ${numberOfPoints} parts without removing or changing any of the script. Base how you split it mostly on the seperation of the following main points - DO NOT USE THE MAIN POINTS DIRECTLY IN THE SPLIT SCRIPT. Here are the ${numberOfPoints} main points: ${mainPointsString}.  Seperate parts with a '|' at the end of each part. IMPORTANT: DO NOT MODIFY THE SCRIPT IN ANY WAY - ONLY SPLIT IT INTO THE PARTS.`,
          },
          { role: "user", content: script },
        ],
      });

      const splitScript = response.choices[0].message.content;
      const splitScriptArray = splitScript.split("|");
      let data = {};
      for (let i = 0; i < splitScriptArray.length; i++) {
        data[i] = { points: mainPoints[i], script: splitScriptArray[i] };
      }
      const dataJson = JSON.stringify(data);
      console.log(dataJson);

      // Write the JSON array to a JSON file
      const jsonFilePath = "skeletonNotes.json";
      fs.writeFileSync(jsonFilePath, dataJson, "utf-8");
      res.status(200).json(dataJson);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    console.log("Received a non-POST request to /api/openAI");
    res.status(405).end();
  }
}
