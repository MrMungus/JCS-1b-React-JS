import React, { useState, useEffect } from 'react';
import { useGetByForceQuery } from '../../services/policeAPI';
import { useSelector } from 'react-redux';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function CrimeMap() {
  const zoom = 12;
  const [map, setMap] = useState(null);
  const [rndMiddleLat, setRndMiddleLat] = useState(51.505);
  const [rndMiddleLng, setRndMiddleLng] = useState(-0.09);
  const [crimeCount, setCrimeCount] = useState(0);
  const [yourPosition, setYourPosition] = useState([0.0, 0.0]);
  const searchBy = useSelector((state) => state.searchBy.byForce);
  const startDate = useSelector((state) => state.startDate);
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

  useEffect(() => {
    var crimeCounter = 0;
    let totalLat = 0.0;
    let totalLng = 0.0;
    let middleLat = 51.505;
    let middleLng = -0.09;
    let validCounter = 0;
    if (isSuccess) {
      availablityData.forEach((location) => {
        crimeCounter += 1;
        if (
          location.location &&
          location.location.latitude &&
          location.location.longitude
        ) {
          validCounter += 1;
          totalLat += parseFloat(location.location.latitude);
          totalLng += parseFloat(location.location.longitude);
        }
      });
      if (validCounter > 0) {
        middleLat = totalLat / validCounter;
        middleLng = totalLng / validCounter;
      }
    }
    if (!isFinite(middleLat) || !isFinite(middleLng)) {
      middleLat = 51.505;
      middleLng = -0.09;
    }
    setRndMiddleLat(middleLat);
    setRndMiddleLng(middleLng);
    setCrimeCount(crimeCounter);
  }, [isSuccess, availablityData]);

  function FlyToButton() {
    const onClick = () => map.flyTo([rndMiddleLat, rndMiddleLng], zoom);
    return (
      <button className="btn btn-outline-dark" onClick={onClick}>
        Center Markers
      </button>
    );
  }
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setYourPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        () => {
          console.log('Unable to retrieve your location');
        }
      );
    }
  }, []);

  function YourPositionMarker() {
    const mapPin = L.icon({
      iconUrl:
        'https://github.com/MrMungus/JCS-1b-React-JS/blob/main/src/map-pin-your-position.png?raw=true',
      iconSize: [26, 43],
      iconAnchor: [13, 44],
      popupAnchor: [0, -25],
    });
    if (yourPosition != [0.0, 0.0]) {
      return (
        <Marker
          position={[yourPosition[0].toFixed(3), yourPosition[1].toFixed(3)]}
          icon={mapPin}
        >
          <Popup>You are here</Popup>
        </Marker>
      );
    }
  }

  function FlyToYourLocationButton() {
    const onClick = () => map.flyTo(yourPosition, zoom);
    return (
      <button className="btn btn-outline-dark" onClick={onClick}>
        Your Location
      </button>
    );
  }
  return (
    <div className="card text-bg-light">
      <div className="card-body">
        <h5 className="card-title">Stop &amp; Search Locations</h5>
        {crimeCount > 0 && (
          <div className="mb-3">
            <h1 className="h6 text-muted">
              Total for{' '}
              {new Date(startDate).toLocaleDateString('en-GB', {
                month: 'long',
                year: 'numeric',
              })}{' '}
              is {crimeCount}
            </h1>
          </div>
        )}
        {isLoading ? (
          <div
            className="spinner-border text-primary text-center"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : isError ? (
          <div className="alert alert-warning" role="alert">
            Error: {isError} - try selecting date and force and try again
          </div>
        ) : (
          <MapContainer
            preferCanvas={true}
            className="mapContainer"
            center={[rndMiddleLat, rndMiddleLng]}
            zoom={zoom}
            scrollWheelZoom={true}
            ref={setMap}
          >
            <YourPositionMarker />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
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
                            <b>Lat:</b>{' '}
                            {parseFloat(location.location.latitude).toFixed(3)}{' '}
                            <b>Lng:</b>{' '}
                            {parseFloat(location.location.longitude).toFixed(3)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
        <div className="row mt-3">
          <div className="col-12 text-end">
            <FlyToYourLocationButton /> <FlyToButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrimeMap;
