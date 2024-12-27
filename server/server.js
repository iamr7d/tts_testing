import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Array of API keys
const API_KEYS = [
  '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',
  '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',
  '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',
  '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',
  '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'
];

let currentKeyIndex = 0;

// Function to get next API key in rotation
function getNextApiKey() {
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

app.use(cors());
app.use(express.json());

// Generate text endpoint
app.post('/api/generate-text', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const groq = new Groq({
      apiKey: getNextApiKey(),
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an AI that helps generate natural and engaging text for text-to-speech applications. Your responses should be well-structured and easy to read aloud."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      stream: false,
    });

    const generatedText = chatCompletion.choices[0]?.message?.content || "";
    res.json({ text: generatedText });
  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
