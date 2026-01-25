import React from 'react';
import Container from 'react-bootstrap/Container';
import './innovation.css';


export default function AppInnovation() {
    return (
        <section id="Innovation" className="block Innovation-block">
            <Container fluid>
                <div className="title-holder">
                    <h1 className="title">Innovations</h1>
                </div>

                <div className="about-parent">
                    {/* Left Section */}
                    <div className="about-item">
                        <img src="/Assets/rocket1.svg" alt="world" className="about-img" />
                        <h2 className="about-subtitle">Unique Aspects</h2>
                        <p>GeoSensei makes geography learning fun with two exciting game modes: classic quizzes and the immersive StreetMap challenge. Test your knowledge of flags, capitals, and countries, or drop into real-world street views and guess the location. With an AI-powered chatbot limited to geography topics, you can explore and learn in a focused, interactive way.

</p>
                    </div>

                    {/* Right Section */}
                    <div className="about-item">
                        <img src="/Assets/rocket2.svg" alt="world" className="about-img" />
                        <h2 className="about-subtitle">Emerging technologies</h2>
GeoSensei integrates advanced technologies to deliver an immersive and scalable learning experience. The "Where Am I?" quiz mode is powered by geospatial data, geotagging, reverse geocoding, and location metadata, allowing users to explore real-world environments and make informed location guesses. These features work together to simulate realistic navigation and improve spatial awareness. Backed by a cloud-based system, GeoSensei supports real-time content updates and consistent performance across devices. Additionally, a geography-focused chatbot with generative text capabilities allows users to interact naturally, ask questions, and receive contextual responses related to geography topics.                  </div>
                </div>
                <div className="div3">                       
                       <img src="/Assets/city.svg" alt="fig" className="city" />                      
                </div>
                <div className="div3">                       
                       <img src="/Assets/ocean.svg" alt="fig" className="wave" />                      
                </div>

            </Container>
        </section>
    );
}
