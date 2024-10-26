import React, { useState, useEffect } from "react";
import "./Login.css";
import logo from "../Assets/iips_logo2.png";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertModal from "../AlertModal/AlertModal";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [d, setDisplay] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    document.title = "Teacher:login";

    // Check if session ID exists in local storage and is still valid
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      // Verify the session ID with the backend
      axios
        .post("iipsonlineexambackend-production.up.railway.app/teacher/verify-session", { sessionId })
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
    setIsLoading(true);

    axios
      .post("iipsonlineexambackend-production.up.railway.app/teacher/login", { email, password })
      .then((response) => {
        console.log(response.data.message);
        setShowOtp(true);
        setModalMessage(response.data.message);
        setIsError(false);
        setModalIsOpen(true);
      })
      .catch((error) => {
        console.log(error);
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
      .post("iipsonlineexambackend-production.up.railway.app/teacher/verify-otp", { email, otp })
      .then((response) => {
        const { sessionId, message, teacherId, name, email, mobileNumber,photo } =
          response.data;

        // Set modal state first
        setModalMessage(message);
        setIsError(false);
        setModalIsOpen(true);

        // Navigate after a short delay to ensure modal is shown
        setTimeout(() => {
          // Store session ID and teacher's details in local storage
          localStorage.setItem("sessionId", sessionId);
          localStorage.setItem("teacherId", teacherId);
          localStorage.setItem("name", name);
          localStorage.setItem("email", email);
          localStorage.setItem("photo", photo);
          localStorage.setItem("mobileNumber", mobileNumber);

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

  return (
    <div className="lpgin-container-main">
      <div className="login-container">
        <img src={logo} alt="Logo" />
        <h2>Teacher : Login</h2>
        <form onSubmit={showOtp ? handleSubmit : handleLogin}>
          <div>
            <label>Email:</label>
            <div>
              <input
                type="email"
                value={email}
                placeholder="Enter your Email"
                onChange={(e) => setEmail(e.target.value)}
                disabled={showOtp}
                required
              />
            </div>
          </div>

          <div>
            <label>Password:</label>
            <div className="eye-container">
              <input
                type={d ? "text" : "password"}
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={showOtp}
                required
                className="password-eye"
              />
              {d ? (
                <FaEye
                  className="eyes"
                  onClick={() => {
                    setDisplay(false);
                  }}
                />
              ) : (
                <FaEyeSlash
                  className="eyes"
                  onClick={() => {
                    setDisplay(true);
                  }}
                />
              )}
            </div>
          </div>
          {showOtp && (
            <div>
              <label>OTP:</label>
              <div>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          <p
            className="login_forgot_password"
            onClick={() => navigate("/forgot_password")}
          >
            Forgot Password?
          </p>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Submiting..." : showOtp ? "Submit" : "Next"}
          </button>
          <p
            className="signup_text_redirect"
            onClick={() => navigate("/sign_up")}
          >
            {" "}
            Want to create Account? Signup.{" "}
          </p>
        </form>
        <AlertModal
          isOpen={modalIsOpen}
          onClose={handleCloseModal}
          message={modalMessage}
          iserror={isError}
        />
      </div>
    </div>
  );
}

export default Login;
