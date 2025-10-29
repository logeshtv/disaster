import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom disaster icon (red)
const disasterIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="32" height="32">
      <path d="M12 2L2 22h20L12 2zm0 4l6.5 14h-13L12 6z"/>
      <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">!</text>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Custom hub icon (green)
const hubIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" width="28" height="28">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `),
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
});

export default function MapView({ center, zoom = 10, markers = [] }) {
  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-inner">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            position={marker.position}
            icon={marker.type === 'disaster' ? disasterIcon : hubIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold mb-1">{marker.popup}</p>
                {marker.inventory && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600">Available Supplies:</p>
                    <ul className="text-xs mt-1">
                      {Object.entries(marker.inventory).slice(0, 3).map(([item, qty]) => (
                        <li key={item}>• {item}: {qty}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Circle around disaster location */}
        {markers.length > 0 && markers[0].type === 'disaster' && (
          <Circle
            center={markers[0].position}
            radius={50000} // 50km
            pathOptions={{
              color: 'red',
              fillColor: 'red',
              fillOpacity: 0.1
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
