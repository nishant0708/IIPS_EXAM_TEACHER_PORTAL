import React from "react";
import "./Reset_Password.css";
import Logo from "../Assets/iips_logo2.png";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
const Reset_Password=()=>
{
    const [d0,setDisplay0] = useState("block");
    const [d1,setDisplay1] = useState("block");
    const toggleEye=(index)=>
    {
        const input = document.getElementsByClassName("password-toggle")[index];
        const eye = document.getElementsByClassName("eye-icon")[index];
        const eye_slash = document.getElementsByClassName("eye-icon-slash")[index];
        if(index===0)
        {
            if(d0=== "none")
            {
                eye.style.display="none";
                eye_slash.style.display="block";
                input.type="password";
                setDisplay0("block");
            }
            else
            {
                eye_slash.style.display="none";
                eye.style.display="block";
                input.type="text";
                setDisplay0("none");
            }
        }
        else
        {
            if(d1=== "none")
            {
                eye.style.display="none";
                eye_slash.style.display="block";
                input.type="password";
                setDisplay1("block");
            }
            else
            {
                eye_slash.style.display="none";
                eye.style.display="block";
                input.type="text";
                setDisplay1("none");
            }
        }
    }
    return(
        <>
        <div className="reset-container">
            <img alt="logo" src={Logo}/>
            <h2>Teacher : Reset Password</h2>
            <form>
                <label>Password:</label>
                <div className="input-password">
                    <input type="password" placeholder="Enter your New Password" className="password-toggle"/>
                    <FaEye className="eye-icon" onClick={()=>{toggleEye(0);}}/>
                    <FaEyeSlash className="eye-icon-slash" onClick={()=>{toggleEye(0);}}/>
                </div>
                <label>Confirm Password:</label>
                <div className="input-password">
                    <input type="password" placeholder="Confirm your New Password" className="password-toggle"/>
                    <FaEye className="eye-icon" onClick={()=>{toggleEye(1);}}/>
                    <FaEyeSlash className="eye-icon-slash" onClick={()=>{toggleEye(1);}}/>
                </div>
                <button>Change</button>
            </form>
        </div>
        </>
    );
}

export default Reset_Password;