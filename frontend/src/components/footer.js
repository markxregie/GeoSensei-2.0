import React from "react";
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import './footer.css';

export default function AppFooter() {
    return (
        <footer className="footer">
            <Container fluid>
                <div className="footer-content">
                    <p>&copy; {new Date().getFullYear()} GeoSensei. All Rights Reserved.</p>
                    <ul className="footer-links">
                         <li><Link to="/">Home</Link></li>
                        <li><Link to="/#about">About</Link></li>
                        <li><Link to="/#Innovation">Innovation</Link></li>
                        <li><Link to="/#Beneficiaries">Beneficiaries</Link></li>
                        <li><Link to="/behindtheproject">Behind the Project</Link></li>
                    </ul>
                </div>
            </Container>
        </footer>
    );
}
