import React, { useEffect, useRef, useState, useCallback } from "react";
import { Viewer } from "mapillary-js";
import "./StreetView.css";
import Spinner from "react-bootstrap/Spinner";

// --- Configuration ---
// These are smaller, dense city-sized boxes to maximize the chance of finding images
// while complying with the Mapillary API limit (less than 0.01 sq degrees).
// Format: [min_longitude, min_latitude, max_longitude, max_latitude]
const BOUNDING_BOXES = [
    // North America (High Coverage)
    [-122.42, 37.77, -122.38, 37.81], // San Francisco, CA (Area ~0.0016)
    [-74.01, 40.7, -73.97, 40.74],   // Manhattan, NY (Area ~0.0016)
    // Europe (High Coverage)
    [2.33, 48.84, 2.37, 48.88],     // Paris, France (Area ~0.0016)
    [13.38, 52.5, 13.42, 52.54],     // Berlin, Germany (Area ~0.0016)
    // Asia
    [139.75, 35.65, 139.79, 35.69],  // Tokyo, Japan (Area ~0.0016)
    [121.46, 31.2, 121.5, 31.24],    // Shanghai, China (Area ~0.0016)
    // South America
    [-43.2, -22.92, -43.16, -22.88], // Rio de Janeiro, Brazil (Area ~0.0016)
    // Oceania
    [151.18, -33.88, 151.22, -33.84], // Sydney, Australia (Area ~0.0016)
];

const API_LIMIT = 200; // Increased limit to maximize the chance of finding a result per box

// --- Component ---
const StreetView = ({ onLocationLoaded }) => {
    const viewerRef = useRef(null);
    const viewerInstanceRef = useRef(null);
    const [accessToken, setAccessToken] = useState(null);
    const [imageKey, setImageKey] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const triedBoxesRef = useRef([]); // To track failed bounding boxes

    // Helper to fetch the access token from the backend (Fetched once)
    const fetchAccessToken = useCallback(async () => {
        const tokenResponse = await fetch("http://localhost:3002/api/mapillary/token");
        if (!tokenResponse.ok) {
            throw new Error(`Failed to fetch access token: ${tokenResponse.statusText}`);
        }
        const tokenData = await tokenResponse.json();
        return tokenData.accessToken;
    }, []);

    // Function to fetch a random image key from Mapillary (Optimized retry logic)
    const fetchRandomImageKey = useCallback(async (token) => {
        setLoading(true);
        setError(null);
        
        // 1. Filter out bounding boxes we've already tried and failed
        const availableBoxes = BOUNDING_BOXES.filter(
            (box, index) => !triedBoxesRef.current.includes(index)
        );

        if (availableBoxes.length === 0) {
            setError("Exhausted all known coverage areas without finding an image. Retrying all areas in 5 seconds...");
            console.warn("Exhausted all known coverage areas. Clearing tried boxes and retrying.");
            triedBoxesRef.current = []; // Reset for a full retry
            setTimeout(() => fetchRandomImageKey(token), 5000);
            return;
        }

        // 2. Randomly select one *available* bounding box
        const randomIndex = Math.floor(Math.random() * availableBoxes.length);
        const selectedBboxArray = availableBoxes[randomIndex];
        // Get the original index to track the box we tried
        const originalIndex = BOUNDING_BOXES.findIndex(box => box === selectedBboxArray);
        const bboxParam = selectedBboxArray.join(",");

        console.log(`Attempting to find images in bbox (index ${originalIndex}): ${bboxParam}`);

        try {
            // 3. Construct and execute the API call
            const response = await fetch(
                `https://graph.mapillary.com/images?access_token=${token}&fields=id,geometry&limit=${API_LIMIT}&is_pano=true&bbox=${bboxParam}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Mapillary API Error Response:", errorData);
                throw new Error(`Mapillary API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            }

            const data = await response.json();

            if (data.data && data.data.length > 0) {
                // Success: Select a random image and set the key
                const randomImage = data.data[Math.floor(Math.random() * data.data.length)];
                setImageKey(randomImage.id);
                triedBoxesRef.current = []; // Clear tried boxes on success
                
                // Pass location to parent component
                if (randomImage.geometry && randomImage.geometry.coordinates) {
                    const [lon, lat] = randomImage.geometry.coordinates;
                    onLocationLoaded({ lat, lon });
                }
            } else {
                // Failure: No images found in this box. IMMEDIATELY retry another box (no 2s delay).
                console.warn(`No pano images found in bbox ${originalIndex}. Retrying a different box immediately...`);
                triedBoxesRef.current.push(originalIndex); // Mark this box as tried
                // Use a non-blocking setTimeout (0 delay) to allow the current stack to clear
                setTimeout(() => fetchRandomImageKey(token), 0); 
            }
        } catch (err) {
            console.error("Error during image fetch/viewer setup:", err);
            setError(`Error: ${err.message}. Retrying...`);
            // Wait 5 seconds only for critical API/network errors before trying again
            setTimeout(() => fetchRandomImageKey(token), 5000); 
        }
        
    }, [onLocationLoaded]);

    // 1. Initial Load Effect: Fetch token and start image search
    useEffect(() => {
        let isMounted = true;
        
        const loadTokenAndImages = async () => {
            try {
                const token = await fetchAccessToken();
                if (isMounted) {
                    setAccessToken(token);
                    fetchRandomImageKey(token); // Start the image search chain
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load Mapillary access token.');
                    setLoading(false);
                }
            }
        };

        loadTokenAndImages();

        return () => {
            isMounted = false; // Cleanup flag
        };
    }, [fetchAccessToken, fetchRandomImageKey]);

    // 2. Viewer Setup Effect: Runs when a valid imageKey is found
    useEffect(() => {
        if (!viewerRef.current || !imageKey || !accessToken) {
            return;
        }

        setLoading(true); 

        // Cleanup previous viewer instance before creating a new one
        if (viewerInstanceRef.current) {
            console.log("Removing existing viewer instance.");
            
            // NOTE: The Mapillary viewer uses .off() to remove listeners, not .removeListener()
            viewerInstanceRef.current.off("ready", onViewerReady);
            viewerInstanceRef.current.off("error", onViewerError);
            viewerInstanceRef.current.off("nodechanged", onNodeChanged);
            viewerInstanceRef.current.off("image", viewerInstanceRef.current.resize);

            viewerInstanceRef.current.remove(); // Dispose of the viewer
            viewerInstanceRef.current = null;
            if (viewerRef.current) {
                viewerRef.current.innerHTML = "";
            }
        }
        
        console.log("Creating viewer for imageKey:", imageKey);
        
        // Create a new Mapillary Viewer instance
        const viewer = new Viewer({
            container: viewerRef.current,
            accessToken: accessToken, // Use the cached token
            imageId: imageKey,
            components: {
                nav: true,
                attribution: true,
                cover: false,
                marker: false,
            },
        });

        viewerInstanceRef.current = viewer;

        // --- Event Handlers (defined inside the effect for scope) ---
        const onViewerReady = () => {
            console.log("Mapillary Viewer is ready! (Image loaded)");
            setLoading(false);
            viewer.resize();
        };

        const onNodeChanged = (event) => {
            if (event.node && event.node.latLon) {
                onLocationLoaded(event.node.latLon);
            }
            viewer.resize();
        };

        const onViewerError = (err) => {
            console.error("Mapillary Viewer error:", err);
            setError("Mapillary Viewer error: " + err.message);
            setLoading(false);
        };
        
        const handleWindowResize = () => {
            if (viewerInstanceRef.current) {
                viewerInstanceRef.current.resize();
            }
        };

        // --- Event Listeners Attachment ---
        viewer.on("ready", onViewerReady);
        viewer.on("error", onViewerError);
        viewer.on("nodechanged", onNodeChanged);
        viewer.on("image", viewer.resize);
        window.addEventListener("resize", handleWindowResize);

        // Fallback timeout to hide spinner if "ready" event doesn't fire
        const loadingTimeout = setTimeout(() => {
            if (loading) {
                console.warn("Mapillary Viewer ready event timed out, hiding spinner.");
                setLoading(false);
                setError(e => e || "Viewer took too long to load. Please try refreshing.");
            }
        }, 10000);

        // --- Cleanup function (Using .off() for Mapillary listeners) ---
        return () => {
            clearTimeout(loadingTimeout);
            window.removeEventListener("resize", handleWindowResize);
            
            if (viewerInstanceRef.current) {
                // Use .off() to remove event listeners from the Mapillary Viewer!
                viewerInstanceRef.current.off("ready", onViewerReady);
                viewerInstanceRef.current.off("error", onViewerError);
                viewerInstanceRef.current.off("nodechanged", onNodeChanged);
                // Correctly remove the 'image' listener which uses viewer.resize
                viewerInstanceRef.current.off("image", viewerInstanceRef.current.resize); 

                viewerInstanceRef.current.remove();
                viewerInstanceRef.current = null;
            }
            if (viewerRef.current) {
                viewerRef.current.innerHTML = "";
            }
        };

    }, [imageKey, accessToken, onLocationLoaded, loading]);

    // --- Render ---
    return (
        <div className="streetview-container" style={{ position: "relative" }}>
            {/* Display errors */}
            {error && <p style={{ color: "red", textAlign: "center", padding: "10px" }}>{error}</p>}

            {/* Loading spinner */}
            {loading && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <Spinner animation="border" style={{ color: "#5D4A68" }} />
                    <p style={{ color: "#5D4A68", fontSize: "1.1em" }}>Loading Street View...</p>
                </div>
            )}

            {/* Mapillary Viewer container */}
            <div
                ref={viewerRef}
                className="streetview-viewer"
                // Hide the viewer completely while loading to prevent flashes or incomplete renders
                style={{ visibility: loading ? "hidden" : "visible", height: "100%", width: "100%" }}
            />
        </div>
    );
};

export default StreetView;