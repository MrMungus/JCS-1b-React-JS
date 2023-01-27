import React, { useState, useCallback, useEffect } from 'react';
import { useGetByForceQuery } from '../../services/policeAPI';
import { useSelector } from 'react-redux';
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const zoom = 9;
const center = [51.505, -0.09];

function CrimeMap() {
  const [map, setMap] = useState(null);
  let totalLat = 0;
  let totalLng = 0;
  let middleLat = 51.505;
  let middleLng = -0.09;
  let totalCount = 0;
  let processing = false;
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

  // useEffect(() => {
  //   let totalCount = 0;
  //   if (isSuccess) {
  //     availablityData.forEach((item) => {
  //       if (item.location != null) totalCount += 1;
  //     });
  //   }
  // }, [isSuccess, availablityData]);

  if (availablityData) {
    processing = true;
    availablityData.forEach((location) => {
      if (
        location.location &&
        location.location.latitude &&
        location.location.longitude
      ) {
        totalCount += 1;
        totalLat += parseFloat(location.location.latitude);
        totalLng += parseFloat(location.location.longitude);
      }
    });
    if (totalCount > 0) {
      middleLat = totalLat / totalCount;
      middleLng = totalLng / totalCount;
    }
    processing = false;
  }
  if (!isFinite(middleLat) || !isFinite(middleLng)) {
    middleLat = 51.505;
    middleLng = -0.09;
  }
  let rndMiddleLat = middleLat.toFixed(3);
  let rndMiddleLng = middleLng.toFixed(3);
  const [center, setCenter] = useState([rndMiddleLat, rndMiddleLng]);

  function FlyToButton() {
    const onClick = () => map.flyTo([rndMiddleLat, rndMiddleLng], zoom);
    return (
      <button className="btn btn-outline-dark" onClick={onClick}>
        Center Markers
      </button>
    );
  }

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
            //center={[parseFloat(rndMiddleLat), parseFloat(rndMiddleLng)]}
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            ref={setMap}
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
        <div className="row mt-3">
          <div className="col-6">
            <p>
              <b>mid lat: </b>
              {rndMiddleLat} <b>mid lng: </b>
              {rndMiddleLng} <b>Zoom: </b> {zoom} <b>Count: </b> {totalCount}{' '}
            </p>
          </div>
          <div className="col-6 text-end">
            <FlyToButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrimeMap;
