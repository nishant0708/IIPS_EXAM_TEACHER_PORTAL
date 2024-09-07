import React from 'react';
import './error.css';
import panda from "../Assets/pandu.png";
import { useNavigate } from 'react-router-dom'; // Use `useNavigate` instead of `useHistory`

export default function Error404() {
  const navigate = useNavigate(); // Use `useNavigate` hook

  const handleGoBack = () => {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      // If session ID exists, navigate to TeacherDashboard
      navigate('/TeacherDashboard');
    } else {
      // If session ID doesn't exist, redirect to the login page
      navigate('/login');
    }
  };

  return (
    <div className="error-container">
      <h1 className="error404-heading">Error 404</h1>
      <img src={panda} alt="panda" className="panda-image" />
      <p className="error404-text">Oops! Page not found.</p>
      <button className="go-back-button" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
}
