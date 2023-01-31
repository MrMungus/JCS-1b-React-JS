import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function navbar() {
  const [showModal, setShowModal] = useState(false);
  return (
    <nav className="navbar navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src="https://github.com/MrMungus/JCS-1b-React-JS/blob/main/src/police-helmet.png?raw=true"
            alt=""
            width="35"
            height="40"
            className="d-inline-block align-text-top mx-2"
          ></img>
          UK Police Stop &amp; Searches by Force
        </a>
        <div className="d-flex">
          <Button variant="success" onClick={() => setShowModal(true)}>
            info
          </Button>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <img
              src="https://github.com/MrMungus/JCS-1b-React-JS/blob/main/src/police-helmet-dark.png?raw=true"
              alt=""
              width="35"
              height="40"
              className="d-inline-block align-text-top mx-2"
            ></img>
            <Modal.Title>Instructions</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ol>
              <li>Select an available year/month.</li>
              <li>Select an available Police Force.</li>
              <li>Click Get Data.</li>
              <li>
                The API will fetch the selected data, populating the map and
                charts. This can take 20 seconds or so.
              </li>
              <li>
                Some locations might take longer to load markers on the map, as
                places such as Merseyside can conduct over 5000 stop and
                searches in one month. The map may also stutter with a lot of
                markers. If developed further marker clustering would be
                utilised to improve performace. e.g. Dorset and City of London
                forces tend to perform better on the map, as those forces
                conduct relatively low numbers of stop and searches and
                therefore a lower number of markers need to be rendered.
              </li>
              <li>
                Once the markers are loaded you will be able to click the
                'Center Markers' button to fly to the center of that marker
                group.
              </li>
              <li>
                Map markers are clickable and will display information about the
                stop and search at that location in a popup.
              </li>
              <li>
                Use the zoom buttons on the map to zoom in or out. Move around
                the map using mouse click to grab the map canvas.
              </li>
              <li>Select and load more data if you wish.</li>
              <li>
                You can click the 'Your Location' button to fly to your position
                on the map if you allow it and your browser has location
                services enabled. However, MoDNET does tend to block geolocation
                services.{' '}
              </li>
            </ol>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </nav>
  );
}

export default navbar;
