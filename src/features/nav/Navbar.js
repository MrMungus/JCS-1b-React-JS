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
                Map pins are clickable and will display information about the
                crime comitted at that location.
              </li>
              <li>
                Use the zoom buttons on the map to zoom in or out. Move around
                the map using mouse click to grab the map canvas.
              </li>
              <li>Select and load more data if you wish.</li>
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
