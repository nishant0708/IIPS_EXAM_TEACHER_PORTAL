import React, { useEffect, useState } from "react";
import Logo from "../Assets/iips_logo2.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Reset_Password.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import AlertModal from "../AlertModal/AlertModal";
import Loader from "../Loader/Loader";

const Reset_Password = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [d1, setDisplay1] = useState(false);
  const [d2, setDisplay2] = useState(false);
  const [message, setMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false); // Error state for modal
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsError(true);
      setModalIsOpen(true);
      return;
    }

    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const email = urlParams.get("email");

    try {
      const response = await axios.post(
        "http://localhost:5000/teacher/reset-password",
        {
          token,
          email,
          newPassword: password,
        }
      );
      setMessage(response.data.message);
      setIsError(false);
      setModalIsOpen(true);
      setTimeout(() => {
        setModalIsOpen(false);
        navigate("/Login");
      }, 3000);
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
      setIsError(true);
      setModalIsOpen(true);
    }
  };

  return (
    <div className="reset-container-main">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="reset-container">
            <img alt="logo" src={Logo} />
            <h2>Teacher: Reset Password</h2>
            <form onSubmit={handleSubmit}>
              <label>Password:</label>
              <div className="input-password">
                <input
                  type={d1 ? "text" : "password"}
                  placeholder="Enter your New Password"
                  className="password-toggle"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {d1 ? (
                  <FaEye
                    className="eye-icon"
                    onClick={() => {
                        setDisplay1(false);
                    }}
                  />
                ) : (
                  <FaEyeSlash
                    className="eye-icon-slash"
                    onClick={() => {
                      setDisplay1(true);
                    }}
                  />
                )}
              </div>
              <label>Confirm Password:</label>
              <div className="input-password">
                <input
                  type={d2 ? "text" : "password"}
                  placeholder="Confirm your New Password"
                  className="password-toggle"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {
                    d2 ? 
                    (<FaEye
                        className="eye-icon"
                        onClick={() => {
                          setDisplay2(false);
                        }}
                      />) 
                    :
                    (<FaEyeSlash
                        className="eye-icon-slash"
                        onClick={() => {
                          setDisplay2(true);
                        }}
                    />)
                }
              </div>
              <button type="submit">Reset Password</button>
            </form>

            {/* Use the AlertModal component */}
            <AlertModal
              isOpen={modalIsOpen}
              onClose={() => setModalIsOpen(false)}
              message={message}
              iserror={isError}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Reset_Password;
