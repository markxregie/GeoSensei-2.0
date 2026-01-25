import React from 'react';
import Container from 'react-bootstrap/Container';
import './About.css';

export default function AppAbout() {
    return (
        <section id="about" className="block about-block">
            <Container fluid>
                <div className="title-holder">
                    <h1 className="title">About Us</h1>
                </div>

                <div className="about-parent">
                    {/* Left Section */}
                    <div className="about-item">
                        <img src="/Assets/world.svg" alt="world" className="about-img" />
                        <h2 className="about-subtitle">What is GeoSensei</h2>
                        <p>         GeoSensei is an engaging and educational web app designed to make learning about geography enjoyable for everyone. It serves as more than just a learning app. It is a comprehensive geography learning and entertainment platform that caters to individuals passionate about geography or those looking to expand their knowledge of the world.</p>
                    </div>

                    {/* Right Section */}
                    <div className="about-item">
                        <img src="/Assets/inspo.svg" alt="world" className="about-img" />
                        <h2 className="about-subtitle"> Inspiration Behind GeoSensei</h2>
                        <p>   The idea for GeoSensei was inspired by a combination of personal interests and the desire to make learning about the world more engaging and enjoyable. Learning apps are a fantastic way to test knowledge while encouraging a deeper understanding of geography. This realization led to the creation of an app that transforms geography education into an interactive experience.</p>
                    </div>
                </div>

                {/* Centered Below */}
                <div className="about-center">
                    <img src="/Assets/sdg.svg" alt="world" className="about-img" />
                    <h2 className="about-subtitle">Alignment with SDG 4: Quality Education</h2>
                    <p>GeoSensei is primarily inspired by Sustainable Development Goal (SDG) Number 4, which focuses on Quality Education. The app aligns with this goal by providing an engaging and educational platform for users of all ages, helping them learn and expand their knowledge about geography in a fun and interactive way.</p>
                </div>
                <div className="parach">                       
                       <img src="/Assets/Parachute.svg" alt="fig" className="parachute" />                      
                </div>
            </Container>
        </section>
    );
}
