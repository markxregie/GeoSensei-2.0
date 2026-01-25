import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet's default icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const correctIcon = new L.Icon({
  iconUrl: require("../images/pin.png"),
  iconRetinaUrl: require("../images/pin.png"),
  iconSize: [35, 41],
  iconAnchor: [17, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  className: "correct-marker",
});

const guessIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
  className: "guess-marker",
});

const MapResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);
  return null;
};

const ClickableMap = ({ onGuessSubmit, showSubmitButton = true, correctLocation, guessedLocation, showResults }) => {
    const [guessLocation, setGuessLocation] = useState(null);

    // Reset local guessLocation when showResults changes to true
    useEffect(() => {
        if (showResults) {
            setGuessLocation(null);
        }
    }, [showResults]);

    const MapClickHandler = () => {
        useMapEvents({
            click: (event) => {
                setGuessLocation([event.latlng.lat, event.latlng.lng]);
            },
        });

        return null;
    };

    // If showResults is true, use guessedLocation from props instead of local guessLocation state
    const displayGuessLocation = showResults ? guessedLocation : guessLocation;

    // Normalize coordinates to [lat, lon] array if they are objects with lat and lon properties
    const normalizeCoords = (coords) => {
        if (!coords) return null;
        if (Array.isArray(coords)) return coords;
        if (typeof coords === "object" && coords.lat !== undefined && coords.lon !== undefined) {
            return [coords.lat, coords.lon];
        }
        return null;
    };

    const normCorrectLocation = normalizeCoords(correctLocation);
    const normDisplayGuessLocation = normalizeCoords(displayGuessLocation);

    // Calculate distance if both locations are available
    const haversineDistance = (coords1, coords2) => {
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
    };

    const distance = normCorrectLocation && normDisplayGuessLocation ? Math.round(haversineDistance(normCorrectLocation, normDisplayGuessLocation)) : null;

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
        <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
            <MapContainer
                center={normCorrectLocation || [20, 0]}
            zoom={showResults ? 4 : 2}
            minZoom={showResults ? 4 : 2}
            maxZoom={18}
            maxBounds={[
                [-90, -180],
                [90, 180]
            ]}
            maxBoundsViscosity={1.0}
            style={{ height: "100%", width: "100%" }}
            >
                <MapResizeHandler />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler />
                {showResults && normCorrectLocation && <Marker position={normCorrectLocation} icon={correctIcon} />}
                {normDisplayGuessLocation && <Marker position={normDisplayGuessLocation} icon={guessIcon} />}
                {showResults && normCorrectLocation && normDisplayGuessLocation && <Polyline positions={[normCorrectLocation, normDisplayGuessLocation]} color="red" />}
            </MapContainer>
            {showResults && distance && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "rgba(93, 74, 104, 0.8)",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontSize: "18px",
                        zIndex: 1100,
                    }}
                >
                    {getPlayfulMessage(distance)} (Distance: {distance} km)
                </div>
            )}
            {!showResults && showSubmitButton && (
                <button
                    onClick={() => {
                        console.log("Submit Guess clicked with guessLocation:", guessLocation);
                        onGuessSubmit(guessLocation);
                    }}
                    disabled={!guessLocation}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1000,
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: "#5D4A68",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Submit Guess
                </button>
            )}
        </div>
    );
};

export default ClickableMap;
