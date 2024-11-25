import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from './connectDB.js';
import Queries from './databaseSchema.js';
dotenv.config();

// Connecting Database

connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({origin : process.env.FRONTEND_URL , credentials:true}));
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running!' });
  });


// Test LLM Query Endpoint

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


app.post('/api/query', async (req, res) => {
    const { prompt } = req.body;
  
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required!' });
    }
  
    try {
        const result = await model.generateContent(prompt);
      res.status(200).json(result.response.text());


    await Queries.create({inputPrompt:prompt,outputResponse:result.response.text()});

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error communicating with OpenAI API' });
    }
  });

  // Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
