import React from "react";
import { Container, Image } from "react-bootstrap";
import bannerImage from "../images/maps.gif";
import profileImage from "../images/2X2.jpg";

const BehindTheProject = () => {
  return (
    <div className="behind-the-project-page" onLoad={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div
        className="banner-container"
        style={{
          position: "relative",
          textAlign: "center",
          color: "white",
          backgroundColor: "#333",
          height: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 20,
        }}
      >
        <button
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 30,
            backgroundColor: "transparent",
            border: "none",
            color: "white",
            fontSize: "1.5rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
          onClick={() => window.location.href = "/"}
          aria-label="Go back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H3.707l4.147 4.146a.5.5 0 0 1-.708.708l-5-5a.5.5 0 0 1 0-.708l5-5a.5.5 0 1 1 .708.708L3.707 7.5H14.5A.5.5 0 0 1 15 8z"/>
          </svg>
          Back
        </button>
        <Image
          src={bannerImage}
          alt="Banner"
          fluid
          style={{ maxHeight: "300px", objectFit: "cover", width: "100%" }}
        />
        <div
          className="banner-text"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h1 style={{ color: "#ddd" }}>Behind the Project</h1>
          <h2 style={{ color: "#ddd" }}>About the Creator</h2>
        </div>
      </div>

      <Container
        className="content-container"
        style={{ marginTop: "20px", paddingLeft: 0, position: "relative" }}
      >
          <div style={{ display: "flex", justifyContent: "flex-start", position: "relative" }}>
            <Image
              src={profileImage}
              alt="Profile"
              roundedCircle
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
                marginLeft: "-150px",
                position: "absolute",
                top: "-120px",
                zIndex: 40,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "90px",
                left: "-150px",
                zIndex: 10,
                color: "#333",
                fontWeight: "bold",
                fontSize: "2rem",
              }}
            >
              Mark Regie A. Magtangob
            </div>
            <div
              style={{
                position: "absolute",
                top: "130px",
                left: "-150px",
                zIndex: 10,
                color: "#666",
                fontWeight: "normal",
                fontSize: "1.2rem",
              }}
            >
              Student from Polytechnic University of the Philippines
            </div>
            <div style={{ display: "flex", position: "absolute", top: "170px", left: "-150px", zIndex: 10, gap: "20px" }}>
              <div
                style={{
                  color: "#555",
                  fontSize: "2rem",
                  fontWeight: "normal",
                  width: "470px",
                  minHeight: "200px",
                  backgroundColor: "#f0f0f0",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  textAlign: "left",
                }}
              >
                <span style={{ fontWeight: "bold" }}>Personal Profile</span>
                <p style={{ whiteSpace: "pre-line", width: "90%", lineHeight: "1.5em", textAlign: "left" }}>
                  I am a third-year BSIT student at the Polytechnic University of the Philippines, Quezon City. I am continuously improving my skills in different areas of IT as I prepare for a career in the fast-changing tech industry.
                </p>
              </div>
              <div
                style={{
                  color: "#555",
                  fontSize: "2rem",
                  fontWeight: "normal",
                  width: "370px",
                  minHeight: "200px",
                  backgroundColor: "#f0f0f0",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  textAlign: "left",
               
                }}
              >
                <span style={{ fontWeight: "bold" }}>Technical Skills</span>
                <p style={{ whiteSpace: "pre-line", width: "90%", lineHeight: "1.5em", textAlign: "left" }}>
                  Front-end Development{"\n"}
                  Web Development{"\n"}
                  UI/UX Designer/System Designer{"\n"}
                  Scrum Development{"\n"}
                  Front-end Development{"\n"}
                  Low-Code Development
                </p>
              </div>
              <div
                style={{
                  color: "#555",
                  fontSize: "2rem",
                  fontWeight: "normal",
                  width: "850px",
                  minHeight: "200px",
                  backgroundColor: "#f0f0f0",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  textAlign: "left",
                }}
              >
                <span style={{ fontWeight: "bold" }}>Skills and expertise</span>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                  <div style={{ width: "30%" }}>
                    <span style={{ fontWeight: "normal" }}>Soft Skills:</span>
                    <p>
                      Teamwork and collaboration<br/>
                      Problem-solving<br/>
                      Time management<br/>
                      Creativity<br/>
                      Adaptability
                    </p>
                  </div>
                  <div style={{ width: "30%", textAlign: "left" }}>
                    <span style={{ fontWeight: "normal" }}>Tools and Software:</span>
                    <p>
                      Visual Studio Code, Visual Studio Community, Pycharm,<br/>
                      Figma, Canva, Lucidchart, Autodesk Sketchbook
                    </p>
                  </div>
                  <div style={{ width: "30%", textAlign: "left" }}>
                    <span style={{ fontWeight: "normal" }}>Programming Languages:</span>
                    <p>
                      HTML<br/>
                      CSS<br/>
                      JavaScript<br/>
                      C#<br/>
                      Python<br/>
                      Java
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "520px",
              left: "-150px",
              marginBottom: "5rem",
              zIndex: 10,
              color: "#555",
              fontSize: "1.8rem",
              fontWeight: "normal",
              width: "1730px",
              minHeight: "200px",
              
              padding: "10px",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              textAlign: "left",
              borderTop: "3px solid #333",
            }}
          >
          <span style={{ fontWeight: "bold", display: "block", textAlign: "center" }}>Inspiration for Geosensei</span>
          <p style={{ textAlign: "center" }}>The idea for GeoSensei came from a shared frustration with how geography is often taught flat, repetitive, and easy to forget. We wanted to build something that feels like an adventure, not a lecture. Inspired by games like GeoGuessr, we thought: what if we could make learning geography as exciting as solving a mystery? That led us to mix interactive street views with location-guessing and fun quizzes. We also noticed how many educational tools lack depth or get boring fast. So, we designed GeoSensei to feel alive—something you can explore, test yourself with, and genuinely enjoy. Whether you're guessing where in the world you are from a random street, or matching flags and capitals, the goal was always the same: make geography something people actually want to come back to.</p>
          
        </div>
        <div style={{ height: "50rem" }}></div>
      </Container>
    </div>
  );
};

export default BehindTheProject;
