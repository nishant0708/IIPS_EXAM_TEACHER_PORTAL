import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Login/Login'
import Papers from './papers/papers'


const App = () => {
  return (
    <Router>
      <Routes>
    
        <Route path="/" element={<Login />} />
        <Route path="/papers" element={< Papers />} />
       
      </Routes>
    </Router>
  )
}

export default App
