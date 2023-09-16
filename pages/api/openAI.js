OpenAI = require("openai")
const dotenv = require("dotenv");
dotenv.config();
const fs = require('fs');
const readline = require("readline");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

const talk = async () => {
  input = "1.1 Classical mechanics. 1.2 Newtonian mechanics 1.3 Lagrangian mechanics 1.4 Hamiltonian mechanics"

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {role: "system", content: "You are to be given texts of a lesson. Please summarize the file in a skeleton note in a markdown format in less than 50 words. No explanation is needed"},
      { role: "user", content: input }],
  });

  console.log(response)

  const jsonString = JSON.stringify(response, null, 2);

  const filePath = 'response.json';

  fs.writeFileSync(filePath, jsonString);
}

talk()