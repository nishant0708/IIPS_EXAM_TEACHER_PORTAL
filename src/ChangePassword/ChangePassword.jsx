import React, { useEffect, useState } from "react";
import "./ChangePassword.css";
import Logo from "../Assets/iips_logo2.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import AlertModal from "../AlertModal/AlertModal";
import Loader from "../Loader/Loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [display1, setDisplay1] = useState(false);
  const [display2, setDisplay2] = useState(false);
  const [message, setMessage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

    const handleSubmit= async(e)=>
    {
        e.preventDefault();
        if(password !== confirmPassword)
        {
            setModalIsOpen(true);
            setMessage("Passwords do not match!!!");
            setIsError(true);
            return;
        }
        try
        {
            const teacherID=localStorage.getItem("teacherId");
            const response=await axios.post("http://localhost:5000/teacher/change-password",{
                newPassword: password,
                teacherId: teacherID,
            });
            setMessage(response.data.message);
            setIsError(false);
            setModalIsOpen(true);
            setTimeout(() => {
                setModalIsOpen(false);
                navigate("/teacherDashboard");
            }, 2000);
        }
        catch(error)
        {
            setMessage(
                error.response?.data?.error || "Something went wrong. Please try again."
            );
            setIsError(true);
            setModalIsOpen(true);
        }
    }

  return (
    <>
      <div className="change-container-main">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="change-container">
              <img src={Logo} alt="Logo" />
              <h2>Teacher: Change Password</h2>
              <form onSubmit={handleSubmit}>
                <label>Password:</label>
                <div className="input-password">
                  <input
                    type={display1 ? "text" : "password"}
                    placeholder="Enter your New Password:"
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    value={password}
                    required
                  />
                  {display1 ? (
                    <FaEye
                      className="eye-icon"
                      onClick={() => {
                        setDisplay1(false);
                      }}
                    />
                  ) : (
                    <FaEyeSlash
                      className="eye-icon"
                      onClick={() => {
                        setDisplay1(true);
                      }}
                    />
                  )}
                </div>
                <label>Confirm Password:</label>
                <div className="input-password">
                  <input
                    type={display2 ? "text" : "password"}
                    placeholder="Confirm your New Password:"
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                    value={confirmPassword}
                    required
                  />
                  {display2 ? (
                    <FaEye
                      className="eye-icon"
                      onClick={() => {
                        setDisplay2(false);
                      }}
                    />
                  ) : (
                    <FaEyeSlash
                      className="eye-icon"
                      onClick={() => {
                        setDisplay2(true);
                      }}
                    />
                  )}
                </div>
                <button type="submit">Change Password</button>
              </form>
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
    </>
  );
};

export default ChangePassword;
