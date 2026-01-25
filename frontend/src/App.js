import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Appheader from "./components/header";
import AppHome from "./components/Home";
import AppAbout from "./components/About";
import AppInnovation from "./components/Innovation";
import AppBenefits from "./components/benefits";
import AppFooter from "./components/footer";
import NewHeader from "./components/newheader";
import GeoSection from "./components/Geosection";
import Chatbot from "./components/Chatbot";
import Guesstheflag from "./components/Guesstheflag";
import Capitals from "./components/capital";
import Landmark from "./components/Landmark";
import Trivia from "./components/Trivia";
import NotFound from "./pages/NotFound";
import Explore from "./pages/Explore";
import Game from "./components/GameScreen"; // GeoGuessing Game Component
import BehindTheProject from "./components/BehindTheProject";

function App() {
  const [continent, setContinent] = useState("Asia");

  return (
    <div className="App">
      <Router>
        <ConditionalChatbot />
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <Appheader />
                <main>
                  <AppHome />
                  <AppAbout />
                  <AppInnovation />
                  <AppBenefits />
                  <AppFooter />
                </main>
              </>
            }
          />

          {/* Continent-Specific Page */}
          <Route path="/newpage/:continent" element={<ContinentPage setContinent={setContinent} />} />

          {/* Dynamic Quiz Route */}
          <Route
            path="/quiz/:quizType/:continent"
            element={<QuizComponent setContinent={setContinent} continent={continent} />}
          />

          {/* GeoGuessing Game */}
          <Route
            path="/geoguess"
            element={
              <>
                {/* Hide header on geoguess page */}
                <main>
                  <Game />
                </main>
              </>
            }
          />

          {/* Behind The Project Page */}
          <Route path="/behindtheproject" element={<BehindTheProject />} />

          {/* 404 Page */}
          <Route path="/explore/:continent" element={<Explore />} />
          <Route path="/trivia" element={<Trivia />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

function ConditionalChatbot() {
  const location = useLocation();
  if (location.pathname === "/geoguess") {
    return null;
  }
  return <Chatbot />;
}

/* ✅ Fix: Show Only One Quiz Component Based on URL */
function QuizComponent({ setContinent, continent }) {
  const { quizType } = useParams();

  return (
    <>
      <NewHeader setContinent={setContinent} activeContinent={continent} />
      <main>
        {quizType === "guess-the-flag" && <Guesstheflag />}
        {quizType === "capitals" && <Capitals />}
        {quizType === "landmark" && <Landmark />}
        {quizType === "trivia" && <Trivia />}
      </main>
    </>
  );
}

/* ✅ Continent Page to Manage Navigation */
function ContinentPage({ setContinent }) {
  const { continent } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!continent) {
      navigate("/newpage/Asia");
    } else {
      setContinent(continent);
    }
  }, [continent, setContinent, navigate]);

  return (
    <>
      <NewHeader setContinent={setContinent} activeContinent={continent} />
      <main>
        <GeoSection continent={continent} />
      </main>
    </>
  );
}

export default App;
