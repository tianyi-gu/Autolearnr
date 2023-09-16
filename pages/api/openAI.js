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
    
      //Script Generation
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are to receive texts used to teach a class. You are to teach generate a continuous texts that would be passed into a Text-To-Speech function to teach the class on the topic. Generate spoken texts ONLY, no explanations, headers, or cues.`,
          },
          {
            role: "user",
            content: input
          }
        ],
      });

      const script = chatCompletion.choices[0].message.content;
      //console.log(script);


      //Skeleton Notes Generation
      let response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: [
          {
            role: "system",
            content:
              "You are to be given texts of a lesson. Please return an array of <div>'s, with each entry representing a main point in the text.\
              Each entry should contain one <h2> tag representing the title of the main point, and a <ul> containing <li>'s representing subpoints. Each array should be a string",
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
      //console.log(numberOfPoints);


        // Recombine main points into a string for prompting
      const mainPointsString = mainPoints.reduce((acc, curr, index) => {
        return acc + `${index + 1}. ${curr} `;
      }, "");
      console.log(mainPointsString);


        // Split script into chunks based on main points
      response = await openai.chat.completions.create({
        temperature: 0
        model: "gpt-3.5-turbo-16k",
        messages: [
          {
            role: "system",
            content: `Split user scripts for a video into ${numberOfPoints} parts without removing or changing any of the script. Base how you split it mostly on the seperation of the following main points - DO NOT USE THE MAIN POINTS DIRECTLY IN THE SPLIT SCRIPT. Here are the ${numberOfPoints} main points: ${mainPointsString}.  Seperate parts with a '|' at the end of each part. IMPORTANT: DO NOT MODIFY THE SCRIPT IN ANY WAY - ONLY SPLIT IT INTO THE PARTS.`,
          },
          { role: "user", content: script },
        ],
      });

      //splitScript is the final script that is split into parts
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
