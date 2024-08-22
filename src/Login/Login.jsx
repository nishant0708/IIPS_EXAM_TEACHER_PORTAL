import React, { useState } from "react";
import "./Login.css"; // Import the CSS file
import logo from "../assets/iips_logo2.png"; // Corrected the import statement

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulate a login process
    if (email && password) {
      setShowOtp(true); // Show OTP field after email and password are entered
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate OTP verification process
    if (otp) {
      alert("Login successful!");
      // Proceed with your login logic here
    } else {
      alert("Please enter the OTP.");
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" /> {/* Corrected image tag */}
      <h2> Teacher : Login</h2>
      <form onSubmit={showOtp ? handleSubmit : handleLogin}>
        <div>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        {showOtp && (
          <div>
            <label>
              OTP:
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </label>
          </div>
        )}
        <button type="submit">
          {showOtp ? "Submit" : "Next"}
        </button>
      </form>
    </div>
  );
}

export default Login;
