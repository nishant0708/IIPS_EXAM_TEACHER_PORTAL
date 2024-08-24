import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
    const [activeLink, setActiveLink] = useState(null);
    const [open, setOpen] = useState(false);

    const responsive = () => {
        const sidebar = document.getElementsByClassName("navbar-sidebar")[0];
        if (!open) {
            sidebar.style.transform = "translateX(0%)";
            setOpen(true);
        } else {
            sidebar.style.transform = "translateX(100%)";
            setOpen(false);
        }
    };

    const handleLinkClick = (linkName) => {
        setActiveLink(linkName);
    };

    return (
        <>
            <div className="navbar">
                <div className="navbar-contents navbar-left-margin">
                    <img
                        alt="Image"
                        className="pfp"
                        src="https://st4.depositphotos.com/9998432/22597/v/450/depositphotos_225976914-stock-illustration-person-gray-photo-placeholder-man.jpg"
                        width="35"
                        height="35"
                    />
                    <div>Nishant Kaushal</div>
                </div>
                <div className="navbar-contents navbar-displayed">
                    <p
                        className={`navbar-papers navbar-links ${activeLink === "navbar-papers" ? "active" : ""}`}
                        onClick={() => {
                            handleLinkClick("navbar-papers");
                        }}
                    >
                        Papers
                    </p>
                    <p
                        className={`navbar-links navbar-ready ${activeLink === "navbar-ready" ? "active" : ""}`}
                        onClick={() => {
                            handleLinkClick("navbar-ready");
                        }}
                    >
                        Ready for Evaluation
                    </p>
                </div>
                <div className="navbar-right-margin navbar-displayed">
                    <p className="navbar-logout">Logout</p>
                </div>
                <div className="navbar-menu navbar-right-margin">
                    <div className={`icon-container ${open ? "open" : ""}`} onClick={responsive}>
                        {!open ? <FaBars size={24} /> : <FaTimes size={24} />}
                    </div>
                </div>
            </div>
            <div className="navbar-sidebar">
                <ul type="none">
                    <li>
                        <p className={`navbar-papers navbar-links`}>Papers</p>
                    </li>
                    <li>
                        <p className={`navbar-links navbar-ready`}>Ready for Evaluation</p>
                    </li>
                    <li>
                        <p className="navbar-logout navbar-logout-menu">Logout</p>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Navbar;
