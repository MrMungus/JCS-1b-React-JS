import React from 'react';
import { useGetByForceQuery } from '../../services/policeAPI';
import { useSelector } from 'react-redux';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function CrimeMap() {
  const searchBy = useSelector((state) => state.searchBy.byForce);
  const mapPin = L.icon({
    iconUrl: 'map-pin.png',
    iconSize: [26, 43],
    iconAnchor: [13, 44],
    popupAnchor: [0, -25],
  });

  const {
    data: availablityData,
    isLoading,
    isSuccess,
    isError,
  } = useGetByForceQuery(searchBy);
  let totalLat = 0;
  let totalLng = 0;
  let middleLat = 51.505;
  let middleLng = -0.09;

  if (availablityData) {
    availablityData.forEach((location) => {
      if (
        location.location &&
        location.location.latitude &&
        location.location.longitude
      ) {
        totalLat += parseFloat(location.location.latitude);
        totalLng += parseFloat(location.location.longitude);
      }
    });
    if (availablityData.length > 0) {
      middleLat = totalLat / availablityData.length;
      middleLng = totalLng / availablityData.length;

      console.log('Tlat:', totalLat);
      console.log('length:', availablityData.length);
      console.log('middleLat:', middleLat);
      console.log('middleLon:', middleLng);
    }
  }
  if (!isFinite(middleLat) || !isFinite(middleLng)) {
    middleLat = 51.505;
    middleLng = -0.09;
  }

  let rndMiddleLat = middleLat.toFixed(2);
  let rndMiddleLng = middleLng.toFixed(2);
  console.log('rndMiddleLat:', rndMiddleLat);
  console.log('rndMiddleLon:', rndMiddleLng);

  return (
    <div className="card text-bg-light">
      <div className="card-body">
        <h5 class="card-title">Locations</h5>
        {isLoading ? (
          <text>loading...</text>
        ) : isError ? (
          <text>Error: {isError}</text>
        ) : (
          <MapContainer
            className="mapContainer"
            center={[parseFloat(rndMiddleLat), parseFloat(rndMiddleLng)]}
            zoom={10}
            scrollWheelZoom={false}
          >
            {availablityData.map((location) => {
              if (
                !location.location ||
                !location.location.latitude ||
                !location.location.longitude
              ) {
                return null;
              }
              return (
                <Marker
                  key={location.id}
                  position={[
                    location.location.latitude,
                    location.location.longitude,
                  ]}
                  icon={mapPin}
                >
                  <Popup>
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">
                          {location.location.street.name}
                        </h5>
                        <p className="card-text">{location.legislation}</p>
                      </div>
                      <div className="card-body">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            <b>Date:</b>{' '}
                            {new Date(location.datetime).toLocaleDateString(
                              'en-GB',
                              {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              }
                            )}
                          </li>
                          <li className="list-group-item">
                            <b>Time:</b>{' '}
                            {new Date(location.datetime).toLocaleTimeString(
                              'en-GB',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </li>
                          <li className="list-group-item">
                            <b>Object of Search:</b> {location.object_of_search}
                          </li>
                          <li className="list-group-item">
                            <b>Type:</b> {location.type}
                          </li>
                          <li className="list-group-item">
                            <b>Self defined ethincity:</b>{' '}
                            {location.self_defined_ethnicity}
                          </li>
                          <li className="list-group-item">
                            <b>Officer defined ethincity:</b>{' '}
                            {location.officer_defined_ethnicity}
                          </li>
                          <li className="list-group-item">
                            <b>Gender:</b> {location.gender}
                          </li>
                          <li className="list-group-item">
                            <b>Age:</b> {location.age_range}
                          </li>
                          <li className="list-group-item">
                            <b>Street name:</b> {location.location.street.name}
                          </li>
                          <li className="list-group-item">
                            <b>Street ID:</b> {location.location.street.id}
                          </li>
                          <li className="list-group-item">
                            <b>Lat:</b> {location.location.latitude}
                          </li>
                          <li className="list-group-item">
                            <b>Lng:</b> {location.location.longitude}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
        )}
      </div>
    </div>
  );
}

export default CrimeMap;
