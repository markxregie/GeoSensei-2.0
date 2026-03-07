require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");


const router = express.Router(); // Use router instead of app
router.use(cors());
router.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Your API Key from environment variable

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

router.post("/message", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const response = await model.generateContent(message);
    const botMessage = response.response.text(); // Get response text

    res.json({ message: botMessage });
  } catch (error) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ error: "Error communicating with Gemini API" });
  }
});

module.exports = router; // Export the router
