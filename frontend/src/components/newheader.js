import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./newheader.css";

export default function NewHeader({ setContinent, activeContinent }) {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get current URL

  const handleNavClick = (continent) => {
    setContinent(continent);
    navigate(`/newpage/${continent}`);
  };

  const handleMapsClick = () => {
    setContinent(null); // ✅ Reset active continent
    navigate("/geoguess");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">GeoSensei</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              onClick={() => handleNavClick("Asia")}
              className={activeContinent === "Asia" && location.pathname !== "/geoguess" ? "active" : ""}
            >
              Asia
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavClick("Africa")}
              className={activeContinent === "Africa" && location.pathname !== "/geoguess" ? "active" : ""}
            >
              Africa
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavClick("Europe")}
              className={activeContinent === "Europe" && location.pathname !== "/geoguess" ? "active" : ""}
            >
              Europe
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavClick("North America")}
              className={activeContinent === "North America" && location.pathname !== "/geoguess" ? "active" : ""}
            >
              N. America
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavClick("South America")}
              className={activeContinent === "South America" && location.pathname !== "/geoguess" ? "active" : ""}
            >
              S. America
            </Nav.Link>
            <Nav.Link
              onClick={() => handleNavClick("Australia")}
              className={activeContinent === "Australia" && location.pathname !== "/geoguess" ? "active" : ""}
            >
              Australia
            </Nav.Link>
            {/* ✅ Fix: Clicking "Maps" resets active continent */}
            <Nav.Link 
              onClick={handleMapsClick}
              className={location.pathname === "/geoguess" ? "active" : ""}
            >
              Maps
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
