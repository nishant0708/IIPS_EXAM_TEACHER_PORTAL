import React from "react";
import "./TeacherDashboard.css";


const Navbar=()=>
{
    return(
        <>
        <div className="navbar-tanishq">
            <div className="contents-tanishq left-margin-tanishq">
                <div>Niko Vajradanti</div>
                <img alt="Image" className="pfp"
                src="https://st4.depositphotos.com/9998432/22597/v/450/depositphotos_225976914-stock-illustration-person-gray-photo-placeholder-man.jpg" 
                width="50" height="50"/>
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