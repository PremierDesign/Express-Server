require("dotenv").config();
const express = require("express");
const app = express();
const OpenAI = require("openai");
const cors = require("cors");

app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// const openai = new OpenAIApi(configuration);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 8020;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.post("/analyze-spending", async (req, res) => {
  const spendingData = req.body;
  const prompt = createPrompt(spendingData);

  try {
    const gptResponse = await openai.completions.create({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 150,
    });

    res.json({ analysis: gptResponse.choices[0].text });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: "Error processing you OpenAI request" });
  }
});

function createPrompt(data) {
  let prompt = "Analyze the following spending data for patterns:\n";
  for (const item of data) {
    prompt += `Category: ${item.category}, Amount: ${item.amount}\n`;
  }

  prompt +=
    "\n Please list up to four paragraphs with each paragraph describing a notable spending patter or Insite. Please add a new line at the end of each paragraph. Also add 5 spaces in front of the first word in each paragraph. \n";

  return prompt;
}
