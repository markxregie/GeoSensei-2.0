import React from "react";
import { useNavigate } from "react-router-dom";
import "./Trivia.css";

const Trivia = () => {
  const navigate = useNavigate();

  return (
    <div className="trivia-container">
      <img src="/Assets/Coming Soon 2.png" alt="Coming Soon" className="trivia-image" />
      <h1 className="trivia-heading">GeoSensei Says: "You're Early to the Expedition!"</h1>
      <p className="trivia-message">The global adventure hasn't begun just yet. Our compass is still spinning, the maps are unfolding, and the brain-bending geography challenges are being carefully crafted. You’ve stumbled onto our secret launch site either you’re a master explorer… or just very lost.

But don’t worry, you haven’t gone off the edge of the world.
GeoSensei is almost ready to take you on an epic quest through countries, capitals, flags, and mysterious locations only the brave dare guess.

So grab your backpack, sharpen your sense of direction, and get ready to test your world knowledge like never before. The journey is coming soon.
</p>
      <p className="trivia-bold-message">The map isn’t ready… but your journey is. Hold tight. The world tour launches soon..</p>
      <button className="teleport-button" onClick={() => navigate("/")}>Teleport to Safety</button>
    </div>
  );
};

export default Trivia;
