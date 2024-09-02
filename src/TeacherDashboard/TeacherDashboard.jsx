import React from 'react';
import Navbar from '../Navbar/Navbar';
import Papers from '../papers/papers';


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
