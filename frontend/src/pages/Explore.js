import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, GeoJSON, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const continentCenters = {
  Africa: { lat: 1.6508, lng: 17.6874, zoom: 3 },
  Asia: { lat: 34.0479, lng: 100.6197, zoom: 3 },
  Europe: { lat: 54.526, lng: 15.2551, zoom: 4 },
  "North America": { lat: 54.526, lng: -105.2551, zoom: 3 },
  "South America": { lat: -8.7832, lng: -55.4915, zoom: 3 },
  Australia: { lat: -25.2744, lng: 133.7751, zoom: 4 },
};

// Approximate continent bounds [southWest, northEast]
const continentBounds = {
  Africa: [
    [-35.0, -20.0],
    [38.0, 52.0]
  ],
  Asia: [
    [1.0, 26.0],
    [77.0, 180.0]
  ],
  Europe: [
    [34.0, -25.0],
    [72.0, 45.0]
  ],
  "North America": [
    [5.0, -170.0],
    [83.0, -50.0]
  ],
  "South America": [
    [-56.0, -82.0],
    [13.0, -34.0]
  ],
  Australia: [
    [-50.0, 110.0],
    [-10.0, 180.0]
  ]
};

function ContinentBoundsSetter({ continent }) {
  const map = useMap();

  useEffect(() => {
    if (continentBounds[continent]) {
      map.fitBounds(continentBounds[continent], { padding: [50, 50] });
    }
  }, [continent, map]);

  return null;
}

// Mapping of continent to country names (ADMIN property in GeoJSON)
const continentCountries = {
  Africa: [
    "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros",
    "Congo", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini",
    "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau",
    "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar",
    "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique",
    "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe",
    "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa",
    "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda",
    "Zambia", "Zimbabwe"
  ],
  Asia: [
    "Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan",
    "Brunei", "Cambodia", "China", "Cyprus", "Georgia", "India", "Indonesia",
    "Iran", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Kuwait",
    "Kyrgyzstan", "Laos", "Lebanon", "Malaysia", "Maldives", "Mongolia",
    "Myanmar", "Nepal", "North Korea", "Oman", "Pakistan", "Palestine",
    "Philippines", "Qatar", "Russia", "Saudi Arabia", "Singapore", "South Korea",
    "Sri Lanka", "Syria", "Taiwan", "Tajikistan", "Thailand", "Timor-Leste",
    "Turkey", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam",
    "Yemen"
  ],
  Europe: [
    "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina",
    "Bulgaria", "Croatia", "Czech Republic", "Denmark", "Estonia", "Finland",
    "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy",
    "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta",
    "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway",
    "Poland", "Portugal", "Romania", "San Marino", "Serbia", "Slovakia", "Slovenia",
    "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Vatican City"
  ],
  "North America": [
    "Antigua and Barbuda", "Bahamas", "Barbados", "Belize", "Canada", "Costa Rica",
    "Cuba", "Dominica", "Dominican Republic", "El Salvador", "Grenada", "Guatemala",
    "Haiti", "Honduras", "Jamaica", "Mexico", "Nicaragua", "Panama", "Saint Kitts and Nevis",
    "Saint Lucia", "Saint Vincent and the Grenadines", "Trinidad and Tobago", "United States"
  ],
  "South America": [
    "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Guyana",
    "Paraguay", "Peru", "Suriname", "Uruguay", "Venezuela"
  ],
  Australia: [
    "Australia", "Fiji", "Kiribati", "Marshall Islands", "Micronesia", "Nauru",
    "New Zealand", "Palau", "Papua New Guinea", "Samoa", "Solomon Islands",
    "Tonga", "Tuvalu", "Vanuatu"
  ]
};

function PopupContent({ countryDetails, selectedFeature, displayedSummary }) {
  return (
    <div>
      <h2>{countryDetails?.name?.common || selectedFeature.properties.ADMIN}</h2>
      {countryDetails ? (
        <>
          <img
            src={countryDetails.flags?.png || countryDetails.flags?.svg}
            alt={`Flag of ${countryDetails.name.common}`}
            style={{ width: "100px", height: "auto" }}
          />
          <p>
            Capital: {countryDetails.capital ? countryDetails.capital[0] : "N/A"}
          </p>
          <p>Population: {countryDetails.population.toLocaleString()}</p>
          <p>{displayedSummary || "Loading country summary..."}</p>
        </>
      ) : (
        <p>Loading country details...</p>
      )}
    </div>
  );
}

export default function Explore() {
  const { continent } = useParams();
  const [geoData, setGeoData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [countryDetails, setCountryDetails] = useState(null);
  const [summary, setSummary] = React.useState(null);
  const [displayedSummary, setDisplayedSummary] = React.useState("");
  const [popupPosition, setPopupPosition] = React.useState(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    )
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
      })
      .catch((err) => {
        console.error("Failed to load GeoJSON data", err);
      });
  }, []);

  React.useEffect(() => {
    if (selectedFeature) {
      console.log("Selected feature properties:", selectedFeature.properties);
      // Determine the correct property for country name
      const countryName = selectedFeature.properties.ADMIN || selectedFeature.properties.admin || selectedFeature.properties.NAME || selectedFeature.properties.name;

      // Immediately fetch Gemini summary on country click
      setSummary("Loading country summary...");

      fetch("http://localhost:3002/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ country: countryName }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch summary");
          }
          return res.json();
        })
        .then((data) => {
          setSummary(data.summary);
        })
        .catch((err) => {
          console.error("Failed to fetch Gemini summary", err);
          setSummary("Failed to load summary.");
        });

      console.log("Fetching country details for:", countryName);
      // Fetch country details from REST Countries API asynchronously
      fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`)
        .then((res) => {
          if (!res.ok) {
            console.warn("Full text search failed, trying partial search");
            // Try partial search fallback
            return fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`)
              .then((res2) => {
                if (!res2.ok) {
                  throw new Error("Country not found in fallback");
                }
                return res2.json();
              });
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.length > 0) {
            setCountryDetails(data[0]);
          } else {
            setCountryDetails(null);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch country details", err);
          setCountryDetails(null);
        });

      // Set popup position once when selectedFeature changes
      setPopupPosition(getPopupPosition(selectedFeature));
    } else {
      setCountryDetails(null);
      setSummary(null);
      setPopupPosition(null);
    }
  }, [selectedFeature]);

  // Typing animation effect for summary
  React.useEffect(() => {
    if (summary && summary !== "Loading country summary..." && summary !== "Failed to load summary.") {
      let index = 0;
      setDisplayedSummary("");
      const interval = setInterval(() => {
        index++;
        setDisplayedSummary(summary.substring(0, index));
        if (index >= summary.length) {
          clearInterval(interval);
        }
      }, 30); // typing speed in ms
      return () => clearInterval(interval);
    } else {
      setDisplayedSummary(summary);
    }
  }, [summary]);

  const center = continentCenters[continent] || { lat: 20, lng: 0, zoom: 2 };

  const onEachCountry = (country, layer) => {
    layer.on({
      click: (e) => {
        setSelectedFeature(country);
        setPopupPosition(e.latlng);
      },
    });
  };

  // Style function to highlight countries based on continent
  const continentStyle = (feature) => {
    const countryName = feature.properties.ADMIN;
    if (continentCountries[continent] && continentCountries[continent].includes(countryName)) {
      return {
        fillColor: "#ff7800",
        weight: 3,
        opacity: 1,
        color: "#00FFFF", // darker outline for continent countries
        dashArray: "3",
        fillOpacity: 0.7,
      };
    } else {
      return {
        fillColor: "#gray",
        weight: 1,
        opacity: 0.5,
        color: "#cccccc", // lighter outline for other countries
        dashArray: "3",
        fillOpacity: 0.2,
      };
    }
  };

  // Fix popup position calculation to handle MultiPolygon and Polygon geometries safely
  const getPopupPosition = (feature) => {
    if (!feature || !feature.geometry) return [center.lat, center.lng];
    const coords = feature.geometry.coordinates;
    if (!coords || coords.length === 0) return [center.lat, center.lng];

    // Handle MultiPolygon and Polygon
    if (feature.geometry.type === "MultiPolygon") {
      // Use first coordinate of first polygon
      return [coords[0][0][0][1], coords[0][0][0][0]];
    } else if (feature.geometry.type === "Polygon") {
      // Use first coordinate of polygon
      return [coords[0][0][1], coords[0][0][0]];
    } else {
      // Default fallback
      return [center.lat, center.lng];
    }
  };

  const navigate = useNavigate();

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={center.zoom}
        maxBounds={[
          [-90, -180],
          [90, 180]
        ]}
        maxBoundsViscosity={1.0}
        style={{ height: "100vh", width: "100%" }}
      >
        <ContinentBoundsSetter continent={continent} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && <GeoJSON data={geoData} onEachFeature={onEachCountry} style={continentStyle} />}
        <Popup
          position={popupPosition || [center.lat, center.lng]}
          onClose={() => setSelectedFeature(null)}
          autoClose={false}
          closeOnClick={false}
          open={Boolean(selectedFeature)}
        >
          {selectedFeature && (
            <PopupContent
              countryDetails={countryDetails}
              selectedFeature={selectedFeature}
              displayedSummary={displayedSummary}
            />
          )}
        </Popup>
      </MapContainer>

      <button
        onClick={() => navigate("/newpage/Asia")}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          padding: "10px 15px",
          fontSize: "16px",
          backgroundColor: "#5D4A68",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000
        }}
      >
        Back
      </button>
    </div>
  );
}
