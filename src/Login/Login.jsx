import React, { useState, useEffect } from "react";
import "./Login.css";
import logo from "../Assets/iips_logo2.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertModal from "../AlertModal/AlertModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Check if session ID exists in local storage and is still valid
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      // Verify the session ID with the backend
      axios
        .post("http://localhost:5000/teacher/verify-session", { sessionId })
        .then((response) => {
          if (response.data.valid) {
            navigate("/teacherDashboard"); // Navigate to dashboard if session is valid
          } else {
            handleLogout();
          }
        })
        .catch(() => handleLogout());
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    axios
      .post("http://localhost:5000/teacher/login", { email, password })
      .then((response) => {
        console.log(response.data.message);
        setShowOtp(true);
        setModalMessage(response.data.message);
        setIsError(false);
        setModalIsOpen(true);
      })
      .catch((error) => {
        setModalMessage(error.response.data.error);
        setIsError(true);
        setModalIsOpen(true);
      })
      .finally(() => {
        setIsLoading(false); // Stop loading
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    axios
      .post("http://localhost:5000/teacher/verify-otp", { email, otp })
      .then((response) => {
        const { sessionId, message } = response.data;

        // Set modal state first
        setModalMessage(message);
        setIsError(false);
        setModalIsOpen(true);

        // Navigate after a short delay to ensure modal is shown
        setTimeout(() => {
          localStorage.setItem("sessionId", sessionId); // Store session ID in local storage
          navigate("/teacherDashboard"); // Navigate to dashboard after successful login
        }, 1000); // Adjust delay as needed
      })
      .catch((error) => {
        setModalMessage(error.response.data.error);
        setIsError(true);
        setModalIsOpen(true);
      })
      .finally(() => {
        setIsLoading(false); // Stop loading
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("sessionId"); // Remove session ID from local storage
    navigate("/"); // Redirect back to login page
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" />
      <h2>Teacher : Login</h2>
      <form onSubmit={showOtp ? handleSubmit : handleLogin}>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              placeholder="Enter your Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="password-input-container">
          <label>
            Password:
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </label>
        </div>
        {showOtp && (
          <div>
            <label>
              OTP:
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </label>
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : showOtp ? "Submit" : "Next"}
        </button>
        <p className="signup_text_redirect" onClick={() => navigate("/sign_up")}>
          Want to create Account? Signup.
        </p>
      </form>
      <AlertModal
        isOpen={modalIsOpen}
        onClose={handleCloseModal}
        message={modalMessage}
        iserror={isError}
      />
    </div>
  );
}

export default Login;
