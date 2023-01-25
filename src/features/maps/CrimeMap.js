import React from 'react';
import { useGetByForceQuery } from '../../services/policeAPI';
import { useSelector } from 'react-redux';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function CrimeMap() {
  const searchBy = useSelector((state) => state.searchBy.byForce);
  const mapPin = L.icon({
    iconUrl:
      'https://github.com/MrMungus/JCS-1b-React-JS/blob/main/src/map-pin.png?raw=true',
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

      //console.log('Tlat:', totalLat);
      //console.log('length:', availablityData.length);
      //console.log('middleLat:', middleLat);
      //console.log('middleLon:', middleLng);
    }
  }
  if (!isFinite(middleLat) || !isFinite(middleLng)) {
    middleLat = 51.505;
    middleLng = -0.09;
  }
  let rndMiddleLat = middleLat.toFixed(3);
  let rndMiddleLng = middleLng.toFixed(3);
  //console.log('rndMiddleLat:', rndMiddleLat);
  //console.log('rndMiddleLon:', rndMiddleLng);

  return (
    <div className="card text-bg-light">
      <div className="card-body">
        <h5 className="card-title">Locations</h5>
        {isLoading ? (
          <p>loading...</p>
        ) : isError ? (
          <p>Error: {isError}</p>
        ) : (
          <MapContainer
            className="mapContainer"
            center={[parseFloat(rndMiddleLat), parseFloat(rndMiddleLng)]}
            zoom={10}
            scrollWheelZoom={false}
          >
            {availablityData.map((location, index) => {
              if (
                !location.location ||
                !location.location.latitude ||
                !location.location.longitude
              ) {
                return null;
              }
              return (
                <Marker
                  key={index}
                  position={[
                    location.location.latitude,
                    location.location.longitude,
                  ]}
                  icon={mapPin}
                >
                  <Popup>
                    <div className="card mx-6">
                      <div className="card-body">
                        <div className="row">
                          <div className="col-12 mb-1">
                            <b>{location.legislation}</b>
                          </div>
                          <div className="col-12">
                            <b>Date:</b>{' '}
                            {new Date(location.datetime).toLocaleDateString(
                              'en-GB',
                              {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              }
                            )}
                            {'  '}
                            <b>Time:</b>{' '}
                            {new Date(location.datetime).toLocaleTimeString(
                              'en-GB',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </div>
                          <div className="col-12">
                            <b>Object of Search:</b> {location.object_of_search}
                          </div>
                          <div className="col-12">
                            <b>Type:</b> {location.type}
                          </div>
                          <div className="col-12">
                            <b>Self defined ethincity:</b>{' '}
                            {location.self_defined_ethnicity}
                          </div>
                          <div className="col-12">
                            <b>Officer defined ethincity:</b>{' '}
                            {location.officer_defined_ethnicity}
                          </div>
                          <div className="col-12">
                            <b>Gender:</b> {location.gender}
                            {'  '}
                            <b>Age:</b> {location.age_range}
                          </div>
                          <div className="col-12">
                            <b>Street name:</b> {location.location.street.name}
                          </div>
                          <div className="col-12">
                            <b>Street ID:</b> {location.location.street.id}
                          </div>
                          <div className="col-12">
                            <b>Lat:</b> {location.location.latitude} <b>Lng:</b>{' '}
                            {location.location.longitude}
                          </div>
                        </div>
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
        <div className="row">
          <div className="col-2">
            <p> Mid Lat: {rndMiddleLat}</p>
          </div>
          <div className="col-2">
            <p> Mid Lng: {rndMiddleLng}</p>
          </div>
          <div className="col-2">
            <p> Zoom: {}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrimeMap;
