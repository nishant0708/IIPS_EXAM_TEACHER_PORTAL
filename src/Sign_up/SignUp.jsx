import React, { useState } from "react";
import "./Sign_up.css";
import var1 from "../Assets/iips_logo2.png";
import { useNavigate } from "react-router-dom";
import AlertModal from "../AlertModal/AlertModal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
  const [isFirstClick, setIsFirstClick] = useState(true); // Track if it is the first click
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Confirm password visibility toggle

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

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
        setTimeout(() => navigate("/verify_passcode"), 2000); // Redirect after showing success message
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

    if (formData.password !== formData.confirmPassword) {
      setAlertMessage("Passwords do not match!");
      setIsErrorAlert(true);
      setIsAlertOpen(true);
      return; // Stop further execution
    }

    if (isFirstClick) {
      setIsWarningOpen(true);
      setIsFirstClick(false); // Disable modal for subsequent clicks
    } else {
      handleSignUp(e); // Proceed with the signup process directly after the first click
    }
  };

  const handleWarningConfirm = () => {
    setIsWarningOpen(false);
    handleSignUp(); // Proceed with sign-up after confirming the warning
  };

  return (
    <div className="sign_up_Box_min">
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
                required
              />
            </label>
          </div>
          <div className="password-input-container">
            <label>
              Password:
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Your Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span className="eye-icon" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </label>
          </div>
          <div className="password-input-container">
            <label>
              Confirm Password:
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Your Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </span>
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
        <p className="signup_text_redirect" onClick={() => navigate("/verify_passcode")}>
          Already Have passcode?
        </p>
      </div>

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
        onClose={() => setIsAlertOpen(false)}
        message={alertMessage}
        iserror={isErrorAlert}
      />
    </div>
  );
};

export default SignUp;