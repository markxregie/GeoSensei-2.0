const express = require("express");
const axios = require("axios");
const cors = require("cors");
const chatbotRoutes = require("./Chatbot");
const authController = require("./controllers/authcontroller");
const path = require('path');
const fs = require('fs');
require("dotenv").config();

// --- DATABASE CONNECTIONS ---
const { db } = require("./db");      // 1. SQLite connection (Keep for Quizzes)
const pool = require("./config/db"); // 2. PostgreSQL connection (For Auth/Users)

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use("/api/chatbot", chatbotRoutes);

// Auth routes
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/verify-otp', authController.verifyOtp);
app.post('/api/auth/forgot-password', authController.forgotPassword);
app.post('/api/auth/reset-password', authController.resetPassword);

// ---------------------------------------------------------
// POSTGRESQL CONNECTION TEST (For your Auth/Users DB)
// ---------------------------------------------------------
app.get('/test-postgres', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      message: '✅ PostgreSQL is Connected!', 
      serverTime: result.rows[0].now 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: '❌ PostgreSQL Connection Failed' });
  }
});

// ---------------------------------------------------------
// MAPILLARY TOKEN LOGIC (Existing Code)
// ---------------------------------------------------------

// Path to token storage file
const tokenFilePath = path.join(__dirname, 'mapillary_tokens.json');

// Load tokens from file if exists
let mapillaryTokens = null;
function loadTokens() {
    if (fs.existsSync(tokenFilePath)) {
        const data = fs.readFileSync(tokenFilePath, 'utf-8');
        mapillaryTokens = JSON.parse(data);
        console.log('Loaded Mapillary tokens from file.');
    } else {
        mapillaryTokens = null;
        console.log('No Mapillary token file found.');
    }
}

// Save tokens to file
function saveTokens(tokens) {
    fs.writeFileSync(tokenFilePath, JSON.stringify(tokens, null, 2));
    mapillaryTokens = tokens;
    console.log('Saved Mapillary tokens to file.');
}

// Refresh access token using refresh token
async function refreshAccessToken() {
    if (!mapillaryTokens || !mapillaryTokens.refresh_token) {
        console.log('No refresh token available.');
        return false;
    }
    const clientId = "24211086625146458";
    const clientSecret = "MLY|24211086625146458|efe4dd32abaff2377c1d17a97de69912";
    const tokenUrl = "https://graph.mapillary.com/token";

    const body = {
        grant_type: "refresh_token",
        refresh_token: mapillaryTokens.refresh_token,
        client_id: clientId
    };

    try {
        const response = await axios.post(tokenUrl, body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `OAuth ${clientSecret}`
            }
        });
        const newTokens = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token || mapillaryTokens.refresh_token,
            expires_in: response.data.expires_in,
            expiry_time: Date.now() + response.data.expires_in * 1000
        };
        saveTokens(newTokens);
        console.log('Access token refreshed successfully.');
        return true;
    } catch (error) {
        console.error('Error refreshing access token:', error.response?.data || error.message);
        return false;
    }
}

// Initialize tokens on server start
loadTokens();
if (mapillaryTokens) {
    if (Date.now() >= mapillaryTokens.expiry_time) {
        console.log('Access token expired, refreshing...');
        refreshAccessToken();
    } else {
        console.log('Access token valid.');
    }
} else {
    console.log('No tokens loaded, manual authorization required.');
}

// Endpoint to redirect user to Mapillary authorization URL
app.get("/api/mapillary/auth", (req, res) => {
    const clientId = "24211086625146458";
    const redirectUri = encodeURIComponent("http://localhost:3002/api/mapillary/callback");
    const authUrl = `https://www.mapillary.com/connect?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=public`;
    res.redirect(authUrl);
});

app.get("/api/mapillary/callback", async (req, res) => {
  const code = req.query.code;
  console.log("Received authorization code:", code);
  const clientId = "24211086625146458";
  const clientSecret = "MLY|24211086625146458|efe4dd32abaff2377c1d17a97de69912";
  const redirectUri = "http://localhost:3002/api/mapillary/callback";  // Do NOT encode here

  if (!code) {
    return res.status(400).send("Authorization code not provided");
  }

  try {
    const tokenUrl = "https://graph.mapillary.com/token";

  const body = {
    code: code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    client_id: clientId
  };

  const response = await axios.post(tokenUrl, body, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `OAuth ${clientSecret}`
    }
  });

    const tokens = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in,
        expiry_time: Date.now() + response.data.expires_in * 1000
    };
    saveTokens(tokens);

    console.log("Obtained access token:", tokens.access_token);
    res.send("Authorization successful. You can close this window.");
  } catch (error) {
    console.error("Error exchanging authorization code for token:", error.response?.data || error.message);
    res.status(500).send("Failed to exchange authorization code for token");
  }
});

app.get("/api/mapillary/token", (req, res) => {
    if (!mapillaryTokens || !mapillaryTokens.access_token || Date.now() >= mapillaryTokens.expiry_time) {
        console.log("Access token missing or expired");
        return res.status(401).json({ error: "Access token not available or expired. Please reauthorize." });
    }
    console.log("Serving Mapillary access token: Present");
    res.json({ accessToken: mapillaryTokens.access_token });
});

// ---------------------------------------------------------
// SQLITE FLAGS API (Existing Code for Quizzes)
// ---------------------------------------------------------

app.get("/api/flags/:continentName", (req, res) => {
    const continentName = req.params.continentName;

    // Get continent id
    const continentQuery = `SELECT id FROM continents WHERE continent_name = ?`;
    db.get(continentQuery, [continentName], (err, continentRow) => {
        if (err) {
            console.error("Error fetching continent:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (!continentRow) {
            return res.status(404).json({ error: "Continent not found" });
        }
        const continentId = continentRow.id;

        // Get countries in the continent
        const countriesQuery = `SELECT id, country_name, flag_image FROM countries WHERE continent_id = ?`;
        db.all(countriesQuery, [continentId], (err, countriesInContinent) => {
            if (err) {
                console.error("Error fetching countries in continent:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            if (countriesInContinent.length === 0) {
                return res.status(404).json({ error: "No countries found in continent" });
            }

            // Select one correct answer randomly
            const correctAnswer = countriesInContinent[Math.floor(Math.random() * countriesInContinent.length)];

            // Get random countries from other continents for options
            const optionsQuery = `
                SELECT id, country_name FROM countries WHERE id != ? ORDER BY RANDOM() LIMIT 3
            `;
            db.all(optionsQuery, [correctAnswer.id], (err, randomOptions) => {
                if (err) {
                    console.error("Error fetching random options:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }

                // Combine correct answer with random options
                const options = randomOptions.map(opt => opt.country_name);
                options.push(correctAnswer.country_name);

                // Shuffle options
                for (let i = options.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [options[i], options[j]] = [options[j], options[i]];
                }

                res.json({
                    correctAnswer: {
                        country_name: correctAnswer.country_name,
                        flag_image: correctAnswer.flag_image
                    },
                    options: options
                });
            });
        });
    });
});

app.get("/api/flags/all/:continentName", (req, res) => {
    const continentName = req.params.continentName;

    // Get continent id
    const continentQuery = `SELECT id FROM continents WHERE continent_name = ?`;
    db.get(continentQuery, [continentName], (err, continentRow) => {
        if (err) {
            console.error("Error fetching continent:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        if (!continentRow) {
            return res.status(404).json({ error: "Continent not found" });
        }
        const continentId = continentRow.id;

        // Get countries in the continent including capital
        const countriesQuery = `SELECT id, country_name, capital, flag_image FROM countries WHERE continent_id = ?`;
        db.all(countriesQuery, [continentId], (err, countriesInContinent) => {
            if (err) {
                console.error("Error fetching countries in continent:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            if (countriesInContinent.length === 0) {
                return res.status(404).json({ error: "No countries found in continent" });
            }

            // For each country, generate options (3 random other capitals + correct capital)
            const results = [];
            let processedCount = 0;

            countriesInContinent.forEach(country => {
                const optionsQuery = `
                    SELECT capital FROM countries WHERE id != ? ORDER BY RANDOM() LIMIT 3
                `;
                db.all(optionsQuery, [country.id], (err, randomOptions) => {
                    if (err) {
                        console.error("Error fetching random options:", err);
                        return res.status(500).json({ error: "Internal server error" });
                    }

                    const options = randomOptions.map(opt => opt.capital);
                    options.push(country.capital);

                    // Shuffle options
                    for (let i = options.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [options[i], options[j]] = [options[j], options[i]];
                    }

                    results.push({
                        correctAnswer: {
                            country_name: country.country_name,
                            capital: country.capital,
                            flag_image: country.flag_image
                        },
                        options: options
                    });

                    processedCount++;
                    if (processedCount === countriesInContinent.length) {
                        res.json(results);
                    }
                });
            });
        });
    });
});

// ---------------------------------------------------------
// GOOGLE GEMINI API (Existing Code)
// ---------------------------------------------------------

const { GoogleGenerativeAI } = require("@google/generative-ai");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.post("/summary", async (req, res) => {
    const country = req.body.country;
    if (!country) {
        return res.status(400).json({ error: "Country name is required" });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Generate a summary prompt
        const prompt = `Provide a short summary about the country ${country}.`;

        const response = await model.generateContent(prompt);
        const summary = response.response.text();

        res.json({ summary });
    } catch (error) {
        console.error("Error generating summary:", error);
        res.status(500).json({ error: "Failed to generate summary" });
    }
});

// ---------------------------------------------------------
// SERVER START & DB CHECK
// ---------------------------------------------------------
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);

    // Check PostgreSQL connection on startup
    try {
        await pool.query('SELECT NOW()');
        console.log('✅ PostgreSQL is Connected!');
    } catch (err) {
        console.error('❌ PostgreSQL Connection Failed:', err.message);
    }
});