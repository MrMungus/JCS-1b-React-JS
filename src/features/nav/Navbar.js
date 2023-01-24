import React from 'react';

function navbar() {
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src="/docs/5.0/assets/brand/bootstrap-logo.svg"
            alt=""
            width="30"
            height="24"
            className="d-inline-block align-text-top"
          ></img>
          UK Police Stop &amp; Searches by Force
        </a>
      </div>
    </nav>
  );
}

export default navbar;
