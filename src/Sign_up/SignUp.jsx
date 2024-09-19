import React, { useEffect, useState } from "react";
import "./Sign_up.css";
import var1 from "../Assets/iips_logo2.png";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import AlertModal from "../AlertModal/AlertModal";
import Loader from "../Loader/Loader";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [isWarningOpen, setIsWarningOpen] = useState(false); // Modal for OTP warning
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Modal for success/failure messages
  const [alertMessage, setAlertMessage] = useState("");
  const [isErrorAlert, setIsErrorAlert] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for signup button
  const [loadingSpinner, setLoadingSpinner] = useState(true);
  const [isFirstClick, setIsFirstClick] = useState(true); // Track if it is the first click
  const [d1, setDisplay1] = useState(false);
  const [d2, setDisplay2] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoadingSpinner(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async () => {
    setLoading(true); // Set loading state
    try {
      const response = await fetch("http://localhost:5000/teacher/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlertMessage("Your account has been created successfully.");
        setIsErrorAlert(false);
        setIsAlertOpen(true);
      } else {
        setAlertMessage(data.error || "Failed to sign up");
        setIsErrorAlert(true);
        setIsAlertOpen(true);
      }
    } catch (err) {
      setAlertMessage("Server error");
      setIsErrorAlert(true);
      setIsAlertOpen(true);
    } finally {
      setLoading(false); // Remove loading state
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setAlertMessage("Passwords do not match!");
      setIsErrorAlert(true);
      setIsAlertOpen(true);
      return; // Stop further execution
    }

    // If it's the first click, open warning modal
    if (isFirstClick) {
      setIsWarningOpen(true);
      setIsFirstClick(false);
    } else {
      handleSignUp();
    }
  };

  const handleWarningConfirm = () => {
    setIsWarningOpen(false);
    handleSignUp();
  };

  const handleAlertConfirm = () => {
    setIsAlertOpen(false);
    navigate("/verify_passcode");
  };

  return (
    <div className="sign_up_Box_min">
      {loadingSpinner ? (
        <Loader />
      ) : (
        <>
          <div className="Sign_up_Box">
            <img src={var1} alt="" />
            <h3>Teacher : Sign Up</h3>
            <form onSubmit={handleFormSubmit}>
              <div>
                <label>
                  Name :
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div>
                <label>
                  Email :
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Mobile No.
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="Enter your Mobile No."
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    pattern="[0-9]{10}" // Validation for exactly 10 digits
                    required
                    title="Mobile number must be exactly 10 digits."
                  />
                </label>
              </div>
              <div>
                <label>
                  Password:
                  <div className="eye-containers">
                    <input
                      type={d1 ? "text" : "password"}
                      name="password"
                      placeholder="Enter Your Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="password-eye"
                    />
                    {d1 ? (
                      <FaEye
                        className="eyes-signup eye-icon-signup"
                        onClick={() => {
                          setDisplay1(false);
                        }}
                      />
                    ) : (
                      <FaEyeSlash
                        className="eyes-signup eye-icon-slash-signup"
                        onClick={() => {
                          setDisplay1(true);
                        }}
                      />
                    )}
                  </div>
                </label>
              </div>
              <div>
                <label>
                  Confirm Password:
                  <div className="eye-containers">
                    <input
                      type={d2 ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Your Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="password-eye"
                    />
                    {d2 ? (
                      <FaEye
                        className="eyes-signup eye-icon-signup"
                        onClick={() => {
                          setDisplay2(false);
                        }}
                      />
                    ) : (
                      <FaEyeSlash
                        className="eyes-signup eye-icon-slash-signup"
                        onClick={() => {
                          setDisplay2(true);
                        }}
                      />
                    )}
                  </div>
                </label>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Sign up"}
              </button>
            </form>
            <p
              className="signup_text_redirect"
              onClick={() => navigate("/verify_passcode")}
            >
              Already Have passcode?
            </p>
          </div>
        </>
      )}

      {/* Warning Modal for OTP */}
      <AlertModal
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        message={`An OTP will be sent to Nishantkaushal0708@gmail.com. Please collect this mail, and after that, you need to verify the code using the "Already Have passcode?" option.`}
        iserror={false}
        onConfirm={handleWarningConfirm} // Confirm OTP sending
      />

      {/* Alert Modal for success/error messages */}
      <AlertModal
        isOpen={isAlertOpen}
        onClose={handleAlertConfirm}
        message={alertMessage}
        iserror={isErrorAlert}
      />
    </div>
  );
};

export default SignUp;
