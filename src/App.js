import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Login/Login'
import TeacherDashboard from './TeacherDashboard/TeacherDashboard'
import Createpaper from './Create_paper/Createpaper'
import SignUp from './Sign_up/SignUp'



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teacherDashboard" element={<TeacherDashboard/>} />
        <Route path="/create-paper" element={< Createpaper />} />
        <Route path="/sign_up" element = {<SignUp/>} />
      </Routes>
    </Router>
  )
}

export default App
