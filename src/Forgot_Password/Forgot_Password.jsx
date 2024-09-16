import React, { useEffect, useState } from "react";
import Logo from "../Assets/iips_logo2.png";
import "./Forgot_Password.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertModal from "../AlertModal/AlertModal";
import Loader from "../Loader/Loader";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading,setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state
    const [isError, setIsError] = useState(false); // Error state for modal
    const navigate = useNavigate();

    useEffect(()=>
    {
        document.title = "Forgot Password";
        setTimeout(()=>{setLoading(false);},1000);
    },[]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/teacher/forgot-password", { email });
            setMessage(response.data.message);
            setIsError(false);
            setModalIsOpen(true);
            setTimeout(() => {
                setModalIsOpen(false);
                navigate("/Login");
            }, 3000); // Optional: Navigate to login after 3 seconds
        } catch (error) {
            setMessage(error.response?.data?.error || "Something went wrong. Please try again.");
            setIsError(true);
            setModalIsOpen(true);
        }
    };

    return (
        <div className="forgot-container-main">
            {loading ? (<Loader />) : (<>
                <div className="forgot-container">
            <img alt="Logo" src={Logo} />
            <h2>Forgot Your Password?</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input 
                    type="email" 
                    name="forgot_email" 
                    placeholder="Enter your Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
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

export default ForgotPassword;
