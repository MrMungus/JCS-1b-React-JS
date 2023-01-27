import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const center = [51.505, -0.09];
const zoom = 13;

function DisplayPosition({ map }) {
  const [position, setPosition] = useState(() => map.getCenter());

  const onClick = useCallback(() => {
    map.flyTo(center, zoom);
  }, [map]);

  const onMove = useCallback(() => {
    setPosition(map.getCenter());
  }, [map]);

  useEffect(() => {
    map.on('move', onMove);
    return () => {
      map.off('move', onMove);
    };
  }, [map, onMove]);

  return (
    <div className="mb-2">
      <b>Lat: </b>
      {position.lat.toFixed(3)} <b>Lng: </b>
      {position.lng.toFixed(3)}{' '}
      <button className="btn btn-outline-dark" onClick={onClick}>
        Pins Center
      </button>
    </div>
  );
}

function CrimeMap() {
  const [map, setMap] = useState(null);
  const mapPin = L.icon({
    iconUrl:
      'https://github.com/MrMungus/JCS-1b-React-JS/blob/main/src/map-pin.png?raw=true',
    iconSize: [26, 43],
    iconAnchor: [13, 44],
    popupAnchor: [0, -25],
  });

  const displayMap = useMemo(
    () => (
      <MapContainer
        className="mapContainer"
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker icon={mapPin} position={center}>
          <Popup>crime happed here</Popup>
        </Marker>
      </MapContainer>
    ),
    []
  );

  return (
    <div>
      {map ? <DisplayPosition map={map} /> : null}
      {displayMap}
    </div>
  );
}

export default CrimeMap;
