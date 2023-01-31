import React from 'react';
import './style.css';
import Navbar from './features/nav/Navbar';
import Controls from './features/controls/Controls';
import ChartAgeRange from './features/charts/AgeRange';
import ChartGender from './features/charts/Gender';
import ChartEthnicity from './features/charts/Ethnicity';
import ChartReason from './features/charts/Reason';
import CrimeMap from './features/maps/CrimeMap';

export default function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <div className="container">
        <Controls></Controls>
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
            <CrimeMap id="map"></CrimeMap>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-sm-12 mb-3">
            <ChartAgeRange></ChartAgeRange>
          </div>
          <div className="col-md-6 col-sm-12 mb-3">
            <ChartGender></ChartGender>
          </div>
          <div className="col-md-6 col-sm-12 mb-3">
            <ChartEthnicity></ChartEthnicity>
          </div>
          <div className="col-md-6 col-sm-12 mb-3">
            <ChartReason></ChartReason>
          </div>
          <div className="col-12 mb-4 text-center">
            <p>by Tristan Halford Jan 2023</p>
          </div>
        </div>
      </div>
    </div>
  );
}
