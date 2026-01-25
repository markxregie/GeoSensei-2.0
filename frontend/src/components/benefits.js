import React from 'react';
import Container from 'react-bootstrap/Container';
import './benefits.css';

export default function AppBenefits() {
    return (
        <section id="Beneficiaries" className="block benefts-block">
            <Container fluid>
                <div className="title-holder">
                    <h1 className="title">Beneficiaries</h1>
                </div>
                

               
                <div className="bene-parent">
                    {/* Left Section */}
                    <div className="about-item">
                        <h2 className="about-subtitle">Target Audience</h2>
                        <p>GeoSensei is designed for a diverse range of users, including students and educators who want to enhance geography learning, geography enthusiasts who enjoy exploring world knowledge, and general learners looking for an interactive way to expand their understanding of the world.</p>
                    </div>

                    {/* Center Image */}
                    <div className="bene">
                        <img src="/Assets/swim.svg" alt="parachute" className="parachute" />
                    </div>

                    {/* Right Section */}
                    <div className="about-item">
                        <h2 className="about-subtitle">Impact</h2>
                        <p>The app provides an engaging alternative to traditional geography learning by incorporating interactive and gamified elements. It encourages self-paced learning, helping users retain knowledge more effectively. Additionally, GeoSensei makes education more accessible and interactive, allowing users to learn anytime and anywhere in an enjoyable way.</p>
                    </div>
                </div>


            </Container>
        </section>
    );
}
