// server/server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import OpenAI from 'openai';

const app = express();
const port = 5000;

app.use(cors({ origin: 'http://localhost:5173' })); // allow Vite frontend
app.use(express.json());

console.log('Server starting...');

// Check if API key is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY is missing in .env');
} else {
  console.log('✅ OPENAI_API_KEY loaded');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/chat', async (req, res) => {
  console.log('📨 Received request at /api/chat');
  const { messages } = req.body;

  if (!messages) {
    console.error('❌ No messages in request body');
    return res.status(400).json({ error: 'Messages are required' });
  }

  console.log('💬 Messages:', messages);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 200,
    });

    console.log('🤖 OpenAI response received');

    const botReply = response.choices[0].message.content;
    console.log('📝 Bot reply:', botReply);

    res.json({ reply: botReply });
  } catch (error) {
    console.error('❌ OpenAI request failed:', error.message);
    res.status(500).json({ reply: 'Oops! Something went wrong.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
