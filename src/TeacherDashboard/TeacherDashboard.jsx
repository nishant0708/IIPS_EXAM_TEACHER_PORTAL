import React from 'react';
import Navbar from '../Navbar/Navbar';
import Papers from '../papers/papers';
// import Navbar from "./Navbar";

const TeacherDashboard=()=>
{
    return(
        <div style={{overflowX:"hidden"}}>
            <Navbar/>
             <Papers/>
        </div>
    );
}

export default TeacherDashboard;