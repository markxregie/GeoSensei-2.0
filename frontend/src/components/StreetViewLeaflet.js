import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

const getRandomLocation = () => {
    const lat = Math.random() * 170 - 85; // -85 to 85
    const lng = Math.random() * 360 - 180; // -180 to 180
    return [lat, lng];
};

const StreetViewLeaflet = ({ onLocationLoaded, onNext }) => {
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const randomLoc = getRandomLocation();
        setLocation(randomLoc);
        onLocationLoaded(randomLoc);
    }, [onLocationLoaded]);

    return (
        <div style={{ height: "50vh" }}>
            {location && (
                <MapContainer center={location} zoom={18} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={location} />
                </MapContainer>
            )}
            <div style={{ textAlign: "center", marginTop: "10px" }}>
                <button onClick={onNext} style={{ padding: "10px 20px", fontSize: "16px" }}>
                    Guess Location
                </button>
            </div>
        </div>
    );
};

export default StreetViewLeaflet;
