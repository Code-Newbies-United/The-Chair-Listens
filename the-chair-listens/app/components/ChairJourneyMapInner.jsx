// Destination: components/ChairJourneyMapInner.jsx
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet's default marker icons break under bundlers unless re-pointed manually
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const SOUTH_AFRICA_CENTER = [-28.4793, 24.6727];

// Builds a numbered badge pin for a visitor group, sized slightly by count
// so "3 people connected" reads at a glance without opening the popup.
function visitorIcon(count) {
    const size = Math.min(24 + count * 2, 44);
    return L.divIcon({
        className: "visitor-pin",
        html: `<div style="
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background-color: #2A4FA0;
            border: 2px solid #AEB8D6;
            color: #F5F6FA;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: sans-serif;
            font-weight: 700;
            font-size: ${size > 32 ? 15 : 13}px;
        ">${count}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
}

export default function ChairJourneyMapInner({ locations = [], visitors = [] }) {
    const center = locations.length
        ? [locations[locations.length - 1].lat, locations[locations.length - 1].lng]
        : SOUTH_AFRICA_CENTER;

    return (
        <MapContainer
            center={center}
            zoom={locations.length ? 6 : 5}
            style={{ width: "100%", height: "440px" }}
            scrollWheelZoom={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {locations.map((loc) =>
                loc.active ? (
                    // Active stop: pulsing gold marker, styled to match the campaign theme
                    <CircleMarker
                        key={loc.id}
                        center={[loc.lat, loc.lng]}
                        radius={10}
                        pathOptions={{
                            color: "#B99B5B",
                            fillColor: "#D9C489",
                            fillOpacity: 0.9,
                            weight: 2,
                        }}
                    >
                        <Popup>
                            <strong>{loc.name}</strong>
                            <br />
                            Currently active
                        </Popup>
                    </CircleMarker>
                ) : (
                    // Past stop: standard marker
                    <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                        <Popup>
                            <strong>{loc.name}</strong>
                            <br />
                            {loc.response_count ?? 0} responses collected
                        </Popup>
                    </Marker>
                )
            )}

            {visitors
                .filter((v) => v.lat != null && v.lng != null)
                .map((v) => (
                    <Marker
                        key={`visitor-${v.location}`}
                        position={[v.lat, v.lng]}
                        icon={visitorIcon(v.visitor_count)}
                    >
                        <Popup>
                            {v.visitor_count} {v.visitor_count === 1 ? "person" : "people"} opened
                            The Chair Listens near {v.location} in the last 24 hours.
                        </Popup>
                    </Marker>
                ))}
        </MapContainer>
    );
}