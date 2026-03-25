import { useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Search, MapPin, Navigation } from 'lucide-react'

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

// Pulsing pin for click-to-place
function createClickIcon() {
  const svg = `
    <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="18" cy="46" rx="6" ry="2" fill="rgba(0,0,0,0.15)"/>
      <path d="M18 0C8.06 0 0 8.06 0 18c0 12.6 16.2 28.4 16.9 29.1a1.5 1.5 0 0 0 2.2 0C19.8 46.4 36 30.6 36 18 36 8.06 27.94 0 18 0z" fill="#D4AF37"/>
      <circle cx="18" cy="17" r="9" fill="white"/>
      <circle cx="18" cy="17" r="5" fill="#D4AF37"/>
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

function FlyToLocation({ position }) {
  const map = useMap()
  if (position) {
    map.flyTo(position, 15, { duration: 1 })
  }
  return null
}

function SearchBox({ onLocationFound }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const timeoutRef = useRef(null)

  const handleSearch = async (q) => {
    setQuery(q)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (q.length < 3) { setResults([]); return }

    timeoutRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`)
        const data = await res.json()
        setResults(data)
      } catch { setResults([]) }
      setSearching(false)
    }, 400)
  }

  const selectResult = (r) => {
    onLocationFound({ lat: parseFloat(r.lat), lng: parseFloat(r.lon) })
    setQuery(r.display_name.split(',').slice(0, 2).join(','))
    setResults([])
  }

  return (
    <div style={{ position: 'absolute', top: 10, left: 10, right: 10, zIndex: 1000 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'white', borderRadius: 8, padding: '6px 10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: '1px solid #e7e5e4'
      }}>
        <Search size={15} style={{ color: '#a8a29e', flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search location..."
          style={{
            border: 'none', outline: 'none', fontSize: 13, width: '100%',
            background: 'transparent', padding: '2px 0'
          }}
        />
      </div>
      {results.length > 0 && (
        <div style={{
          background: 'white', borderRadius: 8, marginTop: 4,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid #e7e5e4',
          maxHeight: 160, overflowY: 'auto'
        }}>
          {results.map((r, i) => (
            <div key={i} onClick={() => selectResult(r)} style={{
              padding: '8px 12px', cursor: 'pointer', fontSize: 12, lineHeight: 1.4,
              borderBottom: i < results.length - 1 ? '1px solid #f5f5f4' : 'none',
              color: '#44403c'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#f0fdf9'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <Navigation size={12} style={{ color: '#065f46', marginTop: 2, flexShrink: 0 }} />
                <span>{r.display_name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {searching && (
        <div style={{
          background: 'white', borderRadius: 8, marginTop: 4, padding: '8px 12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: 12, color: '#a8a29e'
        }}>
          Searching...
        </div>
      )}
    </div>
  )
}

export default function DistributorMap({ distributors = [], onMapClick, clickPosition, interactive = false }) {
  const [flyTarget, setFlyTarget] = useState(null)

  // Calculate center from distributors or default to world center
  const validDistributors = distributors.filter(d => d.latitude && d.longitude)

  let center = [20, 0]
  let zoom = 2

  if (clickPosition) {
    center = [clickPosition.lat, clickPosition.lng]
    zoom = 15
  } else if (validDistributors.length > 0) {
    const avgLat = validDistributors.reduce((sum, d) => sum + d.latitude, 0) / validDistributors.length
    const avgLng = validDistributors.reduce((sum, d) => sum + d.longitude, 0) / validDistributors.length
    center = [avgLat, avgLng]
    zoom = validDistributors.length === 1 ? 10 : 5
  }

  const handleSearchSelect = (latlng) => {
    setFlyTarget([latlng.lat, latlng.lng])
    if (onMapClick) onMapClick(latlng)
  }

  return (
    <div className="map-container" style={{ position: 'relative' }}>
      {interactive && <SearchBox onLocationFound={handleSearchSelect} />}
      {interactive && !clickPosition && (
        <div style={{
          position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
          zIndex: 1000, background: 'rgba(6,95,70,0.9)', color: 'white',
          padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)', pointerEvents: 'none',
          whiteSpace: 'nowrap'
        }}>
          <MapPin size={14} />
          Click on the map to pin distributor location
        </div>
      )}
      {interactive && clickPosition && (
        <div style={{
          position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
          zIndex: 1000, background: 'rgba(212,175,55,0.9)', color: 'white',
          padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)', pointerEvents: 'none',
          whiteSpace: 'nowrap'
        }}>
          <MapPin size={14} />
          Location pinned — click elsewhere to move
        </div>
      )}
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', borderRadius: '8px' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {interactive && <ClickHandler onClick={onMapClick} />}
        {flyTarget && <FlyToLocation position={flyTarget} />}

        {/* Click position marker */}
        {clickPosition && (
          <Marker position={[clickPosition.lat, clickPosition.lng]} icon={createClickIcon()}>
            <Popup>Distributor location</Popup>
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
