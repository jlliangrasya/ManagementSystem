import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Cute SVG pin marker
function createPinIcon(color = '#065f46') {
  const svg = `
    <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Pin shadow -->
      <ellipse cx="18" cy="46" rx="6" ry="2" fill="rgba(0,0,0,0.15)"/>
      <!-- Pin body -->
      <path d="M18 0C8.06 0 0 8.06 0 18c0 12.6 16.2 28.4 16.9 29.1a1.5 1.5 0 0 0 2.2 0C19.8 46.4 36 30.6 36 18 36 8.06 27.94 0 18 0z" fill="${color}"/>
      <!-- Inner circle (white) -->
      <circle cx="18" cy="17" r="9" fill="white"/>
      <!-- Truck icon inside -->
      <g transform="translate(10.5, 10)" fill="${color}">
        <rect x="0" y="4" width="9" height="7" rx="1" />
        <path d="M9 6h3l2.5 3v2h-5.5V6z" />
        <circle cx="4" cy="12" r="1.5" fill="${color}" stroke="white" stroke-width="0.5"/>
        <circle cx="12" cy="12" r="1.5" fill="${color}" stroke="white" stroke-width="0.5"/>
      </g>
    </svg>
  `
  return L.divIcon({
    html: svg,
    className: 'custom-pin',
    iconSize: [36, 48],
    iconAnchor: [18, 46],
    popupAnchor: [0, -40],
  })
}

// Pulsing "you are here" dot for click-to-place
function createClickIcon() {
  const svg = `
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#D4AF3720" stroke="#D4AF37" stroke-width="2"/>
      <circle cx="12" cy="12" r="5" fill="#D4AF37"/>
    </svg>
  `
  return L.divIcon({
    html: svg,
    className: 'custom-pin',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })
}

// Different colors for visual clustering awareness
const COLORS = ['#065f46', '#D4AF37', '#059669', '#C49B2D', '#10b981', '#BFA14A', '#047857', '#A68B2A']

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      if (onClick) onClick(e.latlng)
    }
  })
  return null
}

export default function DistributorMap({ distributors = [], onMapClick, clickPosition, interactive = false }) {
  // Calculate center from distributors or default to world center
  const validDistributors = distributors.filter(d => d.latitude && d.longitude)

  let center = [20, 0]
  let zoom = 2

  if (validDistributors.length > 0) {
    const avgLat = validDistributors.reduce((sum, d) => sum + d.latitude, 0) / validDistributors.length
    const avgLng = validDistributors.reduce((sum, d) => sum + d.longitude, 0) / validDistributors.length
    center = [avgLat, avgLng]
    zoom = validDistributors.length === 1 ? 10 : 5
  }

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', borderRadius: '8px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {interactive && <ClickHandler onClick={onMapClick} />}

        {/* Click position marker */}
        {clickPosition && (
          <Marker position={[clickPosition.lat, clickPosition.lng]} icon={createClickIcon()}>
            <Popup>New location selected</Popup>
          </Marker>
        )}

        {/* Distributor pins */}
        {validDistributors.map((dist, i) => (
          <Marker
            key={dist.id}
            position={[dist.latitude, dist.longitude]}
            icon={createPinIcon(COLORS[i % COLORS.length])}
          >
            <Popup>
              <div className="map-popup">
                <strong>{dist.name}</strong>
                {dist.address && <p>{dist.address}</p>}
                {dist.phone && <p>{dist.phone}</p>}
                {dist.email && <p>{dist.email}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
