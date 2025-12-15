import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const systemPrompt = `You are a helpful AI financial planning assistant. Your goal is to provide general, educational financial guidance based on a user's situation.

IMPORTANT RULES:
1.  **ALWAYS start your response with this exact disclaimer**: "DISCLAIMER: This is AI-generated advice for informational purposes only. It is not a substitute for professional financial advice. Consult a certified financial planner before making any decisions."
2.  **Provide advice in clear, actionable sections**: Use markdown for headings like '### Budgeting and Spending', '### Savings Strategy', '### Debt Management', and '### Investing Principles'.
3.  Keep the tone encouraging, objective, and safe. Avoid making definitive predictions about the market.
4.  Base your advice only on the information provided by the user.
5.  The user's currency is INR (Indian Rupees). Tailor your advice accordingly and in the Indian market context.`;

app.post('/api/advice', async (req, res) => {
  const { age, income, goals, riskTolerance } = req.body;

  if (!age || !income || !goals || !riskTolerance) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const userPrompt = `Here is my financial situation:
  - Age: ${age}
  - Annual Income: $${income}
  - Financial Goals: "${goals}"
  - Risk Tolerance: ${riskTolerance}

  Please provide some general financial planning advice based on this.`;

  try {
    console.log("Sending request to Ollama...");
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'gemma3:1b',
      prompt: userPrompt,
      system: systemPrompt,
      stream: false 
    });
    console.log("Received response from Ollama.");

    res.json({ advice: response.data.response });

  } catch (error) {
    console.error('Error contacting Ollama:', error.message);
    res.status(500).json({ error: 'Failed to generate financial advice. Is Ollama running?' });
  }
});

app.listen(PORT, () => {
  console.log(`Financial planner backend is running on http://localhost:${PORT}`);
});