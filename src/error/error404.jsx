import React from 'react';
import './error.css';
import panda from "../Assets/pandu.png";

export default function Error404() {
  return (
    <div className="error-container">
      <h1 id='text-color'> Error 404</h1>
      <img src={panda} alt="panda" className="panda-image" />
      <p>Oops! Page not found.</p>
      <button className="go-back-button" onClick={() => window.history.back()}>
        Go Back
      </button>
    </div>
  );
}