import React from "react";
import "./Navbar.css";


const Navbar=()=>
{
    return(
        <>
        <div className="navbar-tanishq">
            <div className="contents-tanishq left-margin-tanishq">
               
                <img alt="Image" className="pfp"
                src="https://st4.depositphotos.com/9998432/22597/v/450/depositphotos_225976914-stock-illustration-person-gray-photo-placeholder-man.jpg" 
                width="35" height="35"/>
                 <div>Niko Vajradanti</div>
            </div>
            <div className="contents-tanishq">
                <button className="papers-tanishq">Papers</button>
                <div>
                    Ready for Evaluation
                </div>
            </div>
            <div className="right-margin-tanishq">
                <button className="logout-tanishq">Logout</button>
            </div>
        </div>
        </>
    );
}
export default Navbar;