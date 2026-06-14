import express from "express";
import Groq from "groq-sdk";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/chat", protect, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: "Message is required" });

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: message }],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("Groq API error:", error);
    res.status(500).json({ error: "AI service failed." });
  }
});

export default router;