import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Landmark.css";

function Landmark() {
  const { continent } = useParams();
  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (continent) {
      setLoading(true);
      setError(null);
      setHtmlContent("");

      fetch(
        "https://en.wikipedia.org/w/api.php?action=parse&page=" +
          encodeURIComponent(continent) +
          "&format=json&origin=*&prop=text&section=0"
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch content");
          }
          return response.json();
        })
        .then((data) => {
          if (data.parse && data.parse.text && data.parse.text["*"]) {
            setHtmlContent(data.parse.text["*"]);
          } else {
            setError("No content found for this continent.");
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch content.");
          setLoading(false);
        });
    }
  }, [continent]);

  if (!continent) {
    return <div className="error">No continent specified.</div>;
  }

  if (loading) {
    return <div className="loading">Loading content...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="landmark-container">
      <h1>{continent}</h1>
      <div
        className="landmark-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}

export default Landmark;
