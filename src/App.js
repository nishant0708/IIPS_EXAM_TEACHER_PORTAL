import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Login/Login'
import CreatePaper from './createpaper/CreatePaper';

const App = () => {
  return (
    <Router>
      <Routes>
    
      <Route path="/" element={<Login />} />
      <Route path="/create-paper" element={<CreatePaper />} />
     
      </Routes>
    </Router>
  )
}

export default App
