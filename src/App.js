import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Login/Login'
import TeacherDashboard from './TeacherDashboard/TeacherDashboard'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teacherDashboard" element={<TeacherDashboard/>} />
      </Routes>
    </Router>
  )
}

export default App
