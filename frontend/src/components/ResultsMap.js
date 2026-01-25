import React from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";

function haversineDistance(coords1, coords2) {
    function toRad(x) {
        return (x * Math.PI) / 180;
    }

    const lat1 = coords1[0];
    const lon1 = coords1[1];
    const lat2 = coords2[0];
    const lon2 = coords2[1];

    const R = 6371; // km
    const x1 = lat2 - lat1;
    const dLat = toRad(x1);
    const x2 = lon2 - lon1;
    const dLon = toRad(x2);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d;
}

const ResultsMap = ({ correctLocation, guessedLocation }) => {
    if (!correctLocation || !guessedLocation) return <p>Loading results...</p>;

    const distance = haversineDistance(
        [correctLocation[0], correctLocation[1]],
        [guessedLocation[0], guessedLocation[1]]
    ).toFixed(2);

function getPlayfulMessage(distance) {
    const d = parseFloat(distance);
    if (d === 0) {
        return "Bullseye! You nailed it perfectly! Are you a wizard or what?";
    } else if (d < 5) {
        return "Whoa, so close! Did you peek at the answer?";
    } else if (d < 20) {
        return "Almost there! Your geography skills are decent, I guess.";
    } else if (d < 100) {
        return "Hmm, you’re in the neighborhood. Try not to get lost next time!";
    } else if (d < 500) {
        return "You’re somewhere on the planet, that’s a start!";
    } else if (d < 2000) {
        return "Oof, that’s a stretch. Did you even look at the map?";
    } else if (d < 5000) {
        return "Wow, that’s a wild guess! Were you aiming for a different planet?";
    } else if (d < 10000) {
        return "Completely off the map! Did you just spin the globe and point?";
    } else {
        return "You might want to check your compass... or get one!";
    }
}

    return (
        <div>
            <MapContainer center={correctLocation} zoom={3} style={{ height: "90vh" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={correctLocation} />
                <Marker position={guessedLocation} />
                <Polyline positions={[correctLocation, guessedLocation]} color="red" />
            </MapContainer>
            <div style={{ textAlign: "center", marginTop: "10px", fontSize: "18px" }}>
                {getPlayfulMessage(distance)} (Distance: {distance} km)
            </div>
        </div>
    );
};

export default ResultsMap;
