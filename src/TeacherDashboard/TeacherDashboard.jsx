import React, { useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import Papers from '../papers/papers';

const TeacherDashboard = () => {
    useEffect(() => {
        document.title = "Teacher Dashboard";
    }, []); // Empty dependency array to run only on component mount

    return (
        <div style={{ overflowX: "hidden" }}>
            <Navbar />
            <Papers />
        </div>
    );
}

export default TeacherDashboard;
