"use client"; // remove this line if you're on the Pages Router, not the App Router

import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* ------------------------------------------------------------------
   1. DATA — city centroids + aggregate counts only. NEVER pass a
   user's actual GPS coordinate into this component; resolve to city
   server-side (IP geolocation or a "pick your city" prompt) before
   the data reaches here.
------------------------------------------------------------------ */
const CITY_DATA = [
    { city: "Johannesburg", lat: -26.2041, lng: 28.0473, count: 142 },
    { city: "Pretoria", lat: -25.7479, lng: 28.2293, count: 58 },
    { city: "Durban", lat: -29.8587, lng: 31.0218, count: 97 },
    { city: "Cape Town", lat: -33.9249, lng: 18.4241, count: 121 },
    { city: "Gqeberha", lat: -33.9608, lng: 25.6022, count: 34 },
    { city: "Bloemfontein", lat: -29.0852, lng: 26.1596, count: 21 },
    { city: "East London", lat: -33.0153, lng: 27.9116, count: 16 },
    { city: "Polokwane", lat: -23.9045, lng: 29.4689, count: 12 },
];

/* Colour scale by activity volume — swap for whatever your dashboard
   actually needs to communicate (recency, response type, etc.) */
function colourFor(count) {
    if (count >= 100) return "#ff6b6b"; // high activity
    if (count >= 50) return "#ffd93d"; // medium
    return "#4dd6ff"; // low
}

/* Jitter in degrees — roughly ±5km at these latitudes. Purely
   cosmetic: spreads overlapping pins so a busy city doesn't render
   as a single dot, while staying nowhere near real user locations. */
function jitter(value) {
    return value + (Math.random() - 0.5) * 0.09;
}

function Legend() {
    return (
        <div
            style={{
                position: "absolute",
                top: 16,
                right: 16,
                zIndex: 1000,
                background: "rgba(10,14,20,0.85)",
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: "0.85rem",
                lineHeight: 1.6,
                color: "#fff",
            }}
        >
            <LegendRow colour="#ff6b6b" label="100+ check-ins" />
            <LegendRow colour="#ffd93d" label="50–99 check-ins" />
            <LegendRow colour="#4dd6ff" label="Under 50 check-ins" />
        </div>
    );
}

function LegendRow({ colour, label }) {
    return (
        <div>
            <span
                style={{
                    display: "inline-block",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    marginRight: 6,
                    background: colour,
                }}
            />
            {label}
        </div>
    );
}

export default function ActivityMap() {
    /* Generate jittered pin positions once per mount, not on every
       re-render, so pins don't visibly "jump" if the component
       re-renders for an unrelated reason. */
    const pins = useMemo(() => {
        return CITY_DATA.flatMap(({ city, lat, lng, count }) => {
            const pinsToShow = Math.min(Math.ceil(count / 8), 20); // cap per city
            const colour = colourFor(count);
            return Array.from({ length: pinsToShow }, (_, i) => ({
                key: `${city}-${i}`,
                city,
                count,
                colour,
                position: [jitter(lat), jitter(lng)],
            }));
        });
    }, []);

    return (
        <div style={{ position: "relative", height: "100vh", width: "100%" }}>
            <MapContainer
                center={[-29.0, 24.5]}
                zoom={5.3}
                style={{ height: "100%", width: "100%", background: "#0a0e14" }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="dark-tiles"
                />
                {pins.map(({ key, city, count, colour, position }) => (
                    <CircleMarker
                        key={key}
                        center={position}
                        radius={6}
                        pathOptions={{
                            color: colour,
                            fillColor: colour,
                            fillOpacity: 0.75,
                            weight: 1,
                        }}
                    >
                        <Popup>
                            <strong>{city}</strong>
                            <br />
                            {count} check-ins (city-level only)
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>
            <Legend />
            {/* Dark-mode tile filter — cosmetic only */}
            <style jsx global>{`
                .dark-tiles {
                    filter: invert(1) hue-rotate(180deg) brightness(0.9) contrast(0.9);
                }
            `}</style>
        </div>
    );
}