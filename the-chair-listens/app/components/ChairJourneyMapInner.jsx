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

export default function ChairJourneyMapInner({ locations = [] }) {
    const center = locations.length
        ? [locations[locations.length - 1].lat, locations[locations.length - 1].lng]
        : SOUTH_AFRICA_CENTER;

    return (
        <MapContainer
            center={center}
            zoom={locations.length ? 6 : 5}
            style={{ width: "100%", height: "320px" }}
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
        </MapContainer>
    );
}