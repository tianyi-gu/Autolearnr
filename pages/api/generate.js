import { Configuration, OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export default async function (req, res) {
  const text = req.body.textInput || '';
  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      }
    });
    return;
  }
  try {
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": `Generate a script for a Khan Academy-like educational video on the following content: ${text}`}],
      });
    res.status(200).json({ response: chatCompletion.choices[0].message.content});
    return;
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}