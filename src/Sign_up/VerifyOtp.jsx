import React, { useEffect, useState } from "react";
import "./Sign_up.css";
import { useNavigate } from "react-router-dom";
import var1 from "../Assets/iips_logo2.png";
import AlertModal from "../AlertModal/AlertModal";
import Loader from "../Loader/Loader";

const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading,setLoading] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Modal for success/error messages
  const [alertMessage, setAlertMessage] = useState("");
  const [isErrorAlert, setIsErrorAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{setTimeout(()=>{setLoading(false);},1000);},[]);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/teacher/verifypasscode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.success) {
        setAlertMessage("Verification successful. Please Login");
        setIsErrorAlert(false);
        setIsAlertOpen(true);

        // Delay the navigation to the home page for a few seconds to allow the user to see the success message
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setAlertMessage(data.message || "Failed to verify OTP");
        setIsErrorAlert(true);
        setIsAlertOpen(true);
      }
    } catch (err) {
      setAlertMessage("Server error");
      setIsErrorAlert(true);
      setIsAlertOpen(true);
    }
  };

  return (
    <div className="sign_up_Box_min">
      {loading ? (<Loader />) : (<>
        <div className="Sign_up_Box">
        <img src={var1} alt="" />
        <h3>Enter Your PassCode</h3>
        <form onSubmit={handleVerify} className="verify_passcode_form">
          <div>
            <label>
              Email :
              <input
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>

          <div>
            <label>
              OTP :
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </label>
          </div>

          <button type="submit">Verify & Sign up</button>
        </form>
      </div>
      </>)}

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

export default VerifyOtp;
