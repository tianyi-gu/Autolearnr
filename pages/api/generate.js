import { Configuration, OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export default async function (req, res) {
//   if (!configuration.apiKey) {
//     res.status(500).json({
//       error: {
//         message: "OpenAI API key not configured, please follow instructions in README.md",
//       }
//     });
//     return;
//   }

  const text = req.body.text || '';
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
        messages: [{"role": "user", "content": "What color is the sky?"}],
      });
      console.log(chatCompletion.choices[0].message.content);
    // const completion = await openai.createChatCompletion({
    //   model: "text-davinci-003",
    //   prompt: generatePrompt(text),
    //   temperature: 0.6,
    // });
    res.status(200).json({ response: chatCompletion.choices[0].message.content});
    return;
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
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

function generatePrompt(text) {
  return `What is the color of the sky?`;

// Animal: Cat
// Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
// Animal: Dog
// Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
// Animal: ${capitalizedAnimal}
// Names:`;
}