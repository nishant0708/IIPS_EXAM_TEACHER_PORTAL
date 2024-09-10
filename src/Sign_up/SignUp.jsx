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
  const [loadingSpinner,setLoadingSpinner] = useState(true);
  const [isFirstClick, setIsFirstClick] = useState(true); // Track if it is the first click
  const [d0,setToggle0] = useState("block");
  const [d1,setToggle1] = useState("block");

  useEffect(()=>{setTimeout(()=>{setLoadingSpinner(false);},1000);},[]);

  const toggled=(index)=>
  {
      const input=document.getElementsByClassName("password-eye")[index];
      const eye0=document.getElementsByClassName("eye-icon-signup")[index];
      const eye1=document.getElementsByClassName("eye-icon-slash-signup")[index];
      if(index==0)
      {
          if(d0==="block")
          {
              eye1.style.display="none";
              eye0.style.display="block";
              input.type="text";
              setToggle0("none");
          }
          else
          {
              eye0.style.display="none";
              eye1.style.display="block";
              input.type="password";
              setToggle0("block");
          }
      }
      else
      {
        if(d1==="block")
        {
            eye1.style.display="none";
            eye0.style.display="block";
            input.type="text";
            setToggle1("none");
        }
        else
        {
            eye0.style.display="none";
            eye1.style.display="block";
            input.type="password";
            setToggle1("block");
        }
      }
  }

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

    if (formData.password !== formData.confirmPassword) {
      setAlertMessage("Passwords do not match!");
      setIsErrorAlert(true);
      setIsAlertOpen(true);
      return; // Stop further execution
    }

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
      {loadingSpinner ? (<Loader />) : (<>
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
          <div>
            <label>
              Password:
              <div className="eye-containers">
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Your Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="password-eye"
                />
                <FaEye className="eyes-signup eye-icon-signup" onClick={()=> toggled(0)}/>
                <FaEyeSlash className="eyes-signup eye-icon-slash-signup" onClick={()=> toggled(0)}/>
              </div>
            </label>
          </div>
          <div>
            <label>
              Confirm Password:
              <div className="eye-containers">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Your Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="password-eye"
                />
                <FaEye className="eyes-signup eye-icon-signup" onClick={()=> toggled(1)}/>
                <FaEyeSlash className="eyes-signup eye-icon-slash-signup" onClick={()=> toggled(1)}/>
              </div>
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
      </>)}

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
