import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import axios from "axios";

import userAvatar from "../images/user.gif";
import botAvatar from "../images/bot.gif";
import minimizeIcon from "../images/minus.svg";
import sendIcon from "../images/send.svg";
import stopIcon from "../images/stop.svg";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Suggested clickable questions
  // Removed fixed default questions and replaced with random question generator

  const [suggestedQuestions, setSuggestedQuestions] = useState([]);

  // Function to generate random geography questions
  const generateRandomQuestions = (count) => {
    const countries = ["France", "Germany", "Japan", "Brazil", "Canada", "Australia", "India", "China", "Russia", "Egypt"];
    const questionTemplates = [
      (country) => `What is the capital of ${country}?`,
      () => "Tell me about the continents.",
      (country) => `What countries border ${country}?`,
      (country) => `What is the population of ${country}?`,
      (country) => `Show me the flag of ${country}.`,
      (country) => `What is the language spoken in ${country}?`,
      (country) => `What is the currency used in ${country}?`,
      (country) => `What is the time zone of ${country}?`,
      (country) => `What are some famous landmarks in ${country}?`,
      () => "What are the major rivers in the world?"
    ];

    const questions = [];
    for (let i = 0; i < count; i++) {
      const template = questionTemplates[Math.floor(Math.random() * questionTemplates.length)];
      if (template.length === 0) {
        // template with no argument
        questions.push(template());
      } else {
        const country = countries[Math.floor(Math.random() * countries.length)];
        questions.push(template(country));
      }
    }
    return questions;
  };

  useEffect(() => {
    if (isOpen) {
      const randomQuestions = generateRandomQuestions(6);
      setSuggestedQuestions(randomQuestions);
    }
  }, [isOpen]);

  // Geography-related keywords
  const geographyKeywords = [
    'country', 'countries', 'capital', 'capitals', 'continent', 'continents',
    'geography', 'geographical', 'map', 'maps', 'population', 'border',
    'borders', 'city', 'cities', 'flag', 'flags', 'location', 'earth',
    'mountain', 'mountains', 'river', 'rivers', 'lake', 'lakes', 'ocean',
    'oceans', 'sea', 'seas', 'desert', 'deserts', 'climate', 'weather',
    'region', 'regions', 'state', 'states', 'province', 'provinces',
    'territory', 'territories', 'demographics', 'language', 'languages',
    'culture', 'cultures', 'ethnic', 'currency', 'timezone', 'area',
    'land', 'landmass', 'geology', 'tectonic', 'plate', 'plates',
    'volcano', 'volcanoes', 'earthquake', 'earthquakes', 'latitude',
    'longitude', 'equator', 'hemisphere', 'tropic', 'arctic', 'antarctic',
    'biome', 'biomes', 'ecosystem', 'ecosystems', 'national park',
    'national parks', 'UNESCO', 'heritage site', 'world heritage',
    'atlas', 'globe', 'geopolitics', 'sovereign', 'nation', 'nations'
  ];

  // Greetings keywords and polite conversational phrases
  const greetingKeywords = [
    'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings',
    "how are you", "how r you", "how u doing", "how are u", "how's it going", "what's up", "whats up", "how do you do",
    "what are u", "who are you", "what is your name"
  ];
  
  // Map of greetings/polite phrases to friendly responses
  const greetingResponses = {
    'hi': "Hello! How can I help you with geography today?",
    'hello': "Hello! How can I help you with geography today?",
    'hey': "Hey there! How can I assist you with geography?",
    'good morning': "Good morning! How can I help you with geography today?",
    'good afternoon': "Good afternoon! How can I help you with geography today?",
    'good evening': "Good evening! How can I help you with geography today?",
    'greetings': "Greetings! How can I help you with geography today?",
    "how are you": "I'm just a bot, but I'm here to help you with geography! How can I assist?",
    "how r you": "I'm just a bot, but I'm here to help you with geography! How can I assist?",
    "how u doing": "I'm just a bot, but I'm here to help you with geography! How can I assist?",
    "how are u": "I'm just a bot, but I'm here to help you with geography! How can I assist?",
    "how's it going": "I'm just a bot, but I'm here to help you with geography! How can I assist?",
    "what's up": "I'm here to help you with geography! What would you like to know?",
    "whats up": "I'm here to help you with geography! What would you like to know?",
    "how do you do": "I'm just a bot, but I'm here to help you with geography! How can I assist?",
    "what are u": "I am Geobot, your friendly geography assistant. How can I help you today?",
    "who are you": "I am Geobot, your friendly geography assistant. How can I help you today?",
    "what is your name": "I am Geobot, your friendly geography assistant. How can I help you today?"
  };

  const isGeographyQuestion = (question) => {
    const lowerQuestion = question.toLowerCase();
    return geographyKeywords.some(keyword => lowerQuestion.includes(keyword));
  };

  const handleSuggestedQuestionClick = (question) => {
    // Directly send the clicked question without waiting for input state update
    handleSend(question);
  };

  const getGreetingResponse = (text) => {
    const lowerText = text.toLowerCase().trim();
    for (const greet of greetingKeywords) {
      if (lowerText === greet || lowerText.startsWith(greet + ' ') || lowerText.endsWith(' ' + greet)) {
        return greetingResponses[greet];
      }
    }
    return null;
  };

  const handleSend = async (message) => {
    const msgToSend = message !== undefined ? message : input;
    if (typeof msgToSend === "string" && msgToSend.trim()) {
      const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: msgToSend, sender: "user", time: timestamp },
      ]);
      if (message === undefined) {
        setInput("");
      }

      // Check if input is a greeting or polite phrase
      const greetingResponse = getGreetingResponse(msgToSend);
      if (greetingResponse) {
        const botTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        // Show typing indicator
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Typing...", sender: "bot", time: "" },
        ]);
        setIsBotTyping(true);

        let currentText = "";
        let typingActive = true;
        setIsBotTyping(true);
        for (let i = 0; i < greetingResponse.length; i++) {
          if (!typingActive) break;
          currentText += greetingResponse[i];
          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { text: currentText, sender: "bot", time: botTimestamp },
          ]);
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        typingActive = false;
        setIsBotTyping(false);
        return;
      }

      // Check if question is geography-related
      if (!isGeographyQuestion(msgToSend)) {
        const botTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setMessages((prevMessages) => [
          ...prevMessages,
          { 
            text: "I'm sorry, I only answer geography-related questions. Please ask me about countries, capitals, flags, or other geography topics.", 
            sender: "bot", 
            time: botTimestamp 
          },
        ]);
        return;
      }

      // Show typing indicator
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Typing...", sender: "bot", time: "" },
      ]);
      setIsBotTyping(true);

      abortControllerRef.current = new AbortController();

      try {
        const response = await axios.post(
          "http://localhost:3002/api/chatbot/message",
          { message: msgToSend },
          { signal: abortControllerRef.current.signal }
        );

        const botMessage = response.data.message;
        const botTimestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        let currentText = "";
        for (let i = 0; i < botMessage.length; i++) {
          if (abortControllerRef.current.signal.aborted) return;
          currentText += botMessage[i];

          setMessages((prevMessages) => [
            ...prevMessages.slice(0, -1),
            { text: currentText, sender: "bot", time: botTimestamp },
          ]);
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Bot response stopped.");
        } else {
          console.error("Error sending message:", error);
        }
      } finally {
        setIsBotTyping(false);
      }
    }
  };

  const stopBotResponse = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsBotTyping(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const formatBotMessage = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  };

  return (
    <div className={`chatbot-container ${isOpen ? "" : "minimized"}`} onClick={() => !isOpen && toggleChatbot()}>
      {!isOpen && <img src={botAvatar} alt="Bot Avatar" />}
      {isOpen && (
        <div className="chatbot-content">
          <div className="chatbot-header">
            <img src={botAvatar} alt="Bot Gif" className="bot-gif-circle" />
            <h3>Geobot</h3>
            <button onClick={toggleChatbot} className="minimize-button">
              <img src={minimizeIcon} alt="Minimize" />
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.sender}`}>
                {msg.sender === "bot" && <img src={botAvatar} alt="Bot" className="avatar" />}
                <div className="message-content">
                  {msg.sender === "bot" ? (
                    <span
                      className="message-text"
                      dangerouslySetInnerHTML={{ __html: formatBotMessage(msg.text) }}
                    />
                  ) : (
                    <span className="message-text">{msg.text}</span>
                  )}
                  <div className="timestamp">{msg.time}</div>
                </div>
                {msg.sender === "user" && <img src={userAvatar} alt="User" className="avatar" />}
              </div>
            ))}
            {!messages.some(msg => msg.sender === "user") && (
              <div className="suggested-questions-container">
                <div className="suggested-questions-header">
                  <h2 className="geobot-header">GeoBot</h2>
                  <div className="geobot-subtitle">Your friendly geography assistant</div>
                </div>
                <div className="suggested-questions">
                  {suggestedQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      className="suggested-question-button"
                      onClick={() => handleSuggestedQuestionClick(question)}
                      disabled={isBotTyping}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isBotTyping && handleSend()}
              placeholder="Ask me about geography..."
              disabled={isBotTyping}
            />
            <button onClick={isBotTyping ? stopBotResponse : handleSend} className="send-button">
              <img src={isBotTyping ? stopIcon : sendIcon} alt="Send" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;