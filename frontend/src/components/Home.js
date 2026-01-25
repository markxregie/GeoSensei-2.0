import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import './home.css';
import loadingGif from '../images/loading.gif';  // Import loading GIF

export default function Home() {
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();  // Initialize navigation function

    return (
        <section id="home" className="home-container container-fluid">
            <div className="row align-items-center justify-content-center text-center">
                <div className="parent">
                    <div className="div1">
                        <div className="col-md-6 text-center">
                            <img src="/Assets/globe.svg" alt="fig" className="img-fluid home-image" />
                        </div>
                    </div>
                    <div className="div2">
                        <h1 className="home-title">Welcome to GeoSensei</h1>
                        <p className="lead fs-4">
                            Your ultimate geography learning companion. Get ready to explore, discover, and master the map like never before.
                        </p>
                        <button
                            className="btn btn-primary rounded-pill px-4 py-2 home-button"
                            onClick={() => {
                                setLoading(true); // Set loading to true
                                setTimeout(() => {
                                    navigate('/newpage/Asia'); // Simulate loading delay
                                    setLoading(false); // Set loading to false after navigation
                                }, 1000); // Simulate a 2-second loading time
                            }}
                        >
                            Let's Go!
                        </button>
                    </div>
                </div>
                <div className="div3"> 
                   <img src="/Assets/homecloud.svg" alt="cloud" className="cloud" />
                </div>
            </div>
            {loading && ( // Conditionally render loading GIF
                <div className="loading-overlay">
                    <img src={loadingGif} alt="Loading..." className="loading-gif" />
                </div>
            )}
        </section>
    );
}
