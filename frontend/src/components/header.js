import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import "./Header.css"; // Import the CSS file
import loadingGif from "../images/loading.gif"; // Import loading GIF

export default function Appheader() {
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Navigation function

  const handleNavigation = () => {
    setLoading(true); // Show loading indicator
    setTimeout(() => {
      navigate("/newpage/Asia"); // Navigate after delay
      setLoading(false); // Hide loading indicator
    }, 1000); // Simulate 2s loading
  };

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home" className="navbar-brand">GeoSensei</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="navbar-nav"> 
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#Innovation">Innovation</Nav.Link>
              <Nav.Link href="#Beneficiaries">Beneficiaries</Nav.Link>
            </Nav>
            <Button className="custom-button" onClick={handleNavigation}>
              Let's Go!
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Loading GIF Overlay */}
      {loading && (
        <div className="loading-overlay">
          <img src={loadingGif} alt="Loading..." className="loading-gif" />
        </div>
      )}
    </>
  );
}
