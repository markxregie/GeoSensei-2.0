import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css"; // Import the CSS file

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <img src="/Assets/ufo.png" alt="404 UFO" className="not-found-image" />
      <h1>404</h1>
      <h2>GeoSensei Says: "You're Off the Map!"</h2>
      <p>You've wandered so far, even satellites can't track you!<br />
        Return to familiar territory before you become the next lost civilization!</p>
      <button className="not-found-button" onClick={() => navigate("/")}>
        Teleport to Safety
      </button>
    </div>
  );
};

export default NotFound;
