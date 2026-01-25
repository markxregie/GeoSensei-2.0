import React from "react";
import { useNavigate } from "react-router-dom"; 
import pixelsGif from "../images/pixels.gif";
import capitalgif from "../images/maps.gif";
import landmarkgif from "../images/cs_4.gif";
import triviagif from "../images/trivia.gif"
import "./Geosection.css"; 

const GeoSection = ({ continent }) => {
  const navigate = useNavigate();

  const goToQuiz = (quizType) => {
    if (!continent) return;
    navigate(`/quiz/${quizType}/${continent}`); 
  };

  return (
    <div className="geo-section-container">
      <div className="geo-section-background"></div> 
      
      <div className="geo-section-content"> 
        <h1 className="continent-heading">
          {continent ? continent : "Loading..."}
        </h1>
        <p className="continent-description">
          Explore fun quizzes and games about {continent}.
        </p>

        <div className="game-cards-container">
          <div className="game-card" onClick={() => goToQuiz("guess-the-flag")}>
            <div className="card-image">
              <img src={pixelsGif} alt="Guess the Flag" className="gif-image" />
            </div>
            <h2 className="card-title">Guess the Flag</h2>
          </div>

          <div className="game-card" onClick={() => goToQuiz("capitals")}>
            <div className="card-image">
              <img src={capitalgif} alt="Capitals" className="gif-image" />
            </div>
            
            <h2 className="card-title">Capitals</h2>
          </div>

          <div className="game-card" onClick={() => navigate(`/explore/${continent}`)}>
            <div className="card-image">
              <img src={landmarkgif} alt="Explore" className="gif-image" />
            </div>
            <h2 className="card-title">Explore</h2>
          </div>

          <div className="game-card" onClick={() => navigate("/trivia")}>
            <div className="card-image">
              <img src={triviagif} alt="Capitals" className="gif-image" />
            </div>
            <h2 className="card-title">Trivia</h2>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GeoSection;
