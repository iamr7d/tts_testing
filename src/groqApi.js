import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Enable browser usage
});

export async function getGroqChatCompletion(prompt) {
  return groq.chat.completions.create({
    messages: [
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
}

const API_URL = 'http://localhost:5000/api';

export async function generateSpeechText(prompt) {
  try {
    const response = await fetch(`${API_URL}/generate-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate text');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error generating speech text:", error);
    throw new Error("Failed to generate speech text");
  }
}
