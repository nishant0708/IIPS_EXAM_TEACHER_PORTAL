import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Login/Login'
import TeacherDashboard from './TeacherDashboard/TeacherDashboard'
<<<<<<< Updated upstream
=======
import Papers from './papers/papers'
import Question from './question/question'
>>>>>>> Stashed changes


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teacherDashboard" element={<TeacherDashboard/>} />
<<<<<<< Updated upstream
=======
        <Route path="/papers" element={< Papers />} />
        <Route path="/question" element={< Question />} />
>>>>>>> Stashed changes
      </Routes>
    </Router>
  )
}

export default App
