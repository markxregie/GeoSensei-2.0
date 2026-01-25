import React from "react";
import { Container } from "react-bootstrap";
import ContinentNavbar from "./newheader"; // A separate navbar for continents

export default function NewPage() {
  return (
    <div>
      <ContinentNavbar />
      <Container>
        <h1 className="text-center mt-4">Explore the 7 Continents</h1>
        <p>Discover interesting facts about each continent.</p>
      </Container>
    </div>
  );
}