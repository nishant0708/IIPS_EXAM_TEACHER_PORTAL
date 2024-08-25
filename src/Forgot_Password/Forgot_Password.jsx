import React from "react";
import Logo from "../Assets/iips_logo2.png";
import "./Forgot_Password.css";
import { useNavigate } from "react-router-dom";
const ForgotPassword=()=>
{
    const navigate=useNavigate();
    return(
        <>
        <div className="forgot-container">
            <img alt="Logo" src={Logo}/>
            <h2>Teacher : Forgot Password</h2>
            <form onSubmit={()=> navigate("/Login")}>
                <label>Email:</label>
                <input type="email" name="forgot_email" placeholder="Enter your Email"/>
                <button type="submit">Submit</button>
            </form>
        </div>
        </>
    );
}

export default ForgotPassword;