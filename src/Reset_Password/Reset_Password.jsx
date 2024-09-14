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
    const [d0, setDisplay0] = useState("block");
    const [d1, setDisplay1] = useState("block");
    const [message, setMessage] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state
    const [loading,setLoading] = useState(true);
    const [isError, setIsError] = useState(false); // Error state for modal
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=>
    {
        setTimeout(()=>{setLoading(false)},1000);
    },[]);

    const toggleEye = (index) => {
        const input = document.getElementsByClassName("password-toggle")[index];
        const eye = document.getElementsByClassName("eye-icon")[index];
        const eye_slash = document.getElementsByClassName("eye-icon-slash")[index];
        if (index === 0) {
            if (d0 === "none") {
                eye.style.display = "none";
                eye_slash.style.display = "block";
                input.type = "password";
                setDisplay0("block");
            } else {
                eye_slash.style.display = "none";
                eye.style.display = "block";
                input.type = "text";
                setDisplay0("none");
            }
        } else {
            if (d1 === "none") {
                eye.style.display = "none";
                eye_slash.style.display = "block";
                input.type = "password";
                setDisplay1("block");
            } else {
                eye_slash.style.display = "none";
                eye.style.display = "block";
                input.type = "text";
                setDisplay1("none");
            }
        }
    };

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
            const response = await axios.post("http://localhost:5000/teacher/reset-password", {
                token,
                email,
                newPassword: password,
            });
            setMessage(response.data.message);
            setIsError(false);
            setModalIsOpen(true);
            setTimeout(() => {
                setModalIsOpen(false);
                navigate("/Login");
            }, 3000);
        } catch (error) {
            setMessage(error.response?.data?.error || "Something went wrong. Please try again.");
            setIsError(true);
            setModalIsOpen(true);
        }
    };

    return (
        <div className="reset-container-main">
            {loading ? (<Loader />) : (<>
                <div className="reset-container">
            <img alt="logo" src={Logo} />
            <h2>Teacher: Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <label>Password:</label>
                <div className="input-password">
                    <input 
                        type="password" 
                        placeholder="Enter your New Password" 
                        className="password-toggle" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <FaEye className="eye-icon" onClick={() => { toggleEye(0); }} />
                    <FaEyeSlash className="eye-icon-slash" onClick={() => { toggleEye(0); }} />
                </div>
                <label>Confirm Password:</label>
                <div className="input-password">
                    <input 
                        type="password" 
                        placeholder="Confirm your New Password" 
                        className="password-toggle" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <FaEye className="eye-icon" onClick={() => { toggleEye(1); }} />
                    <FaEyeSlash className="eye-icon-slash" onClick={() => { toggleEye(1); }} />
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
            </>)}
        </div>
    );
};

export default Reset_Password;
