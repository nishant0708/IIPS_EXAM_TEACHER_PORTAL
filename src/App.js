import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Login from './Login/Login';
import TeacherDashboard from './TeacherDashboard/TeacherDashboard';
import Createpaper from './Create_paper/Createpaper';
import SignUp from './Sign_up/SignUp';
import VerifyOtp from './Sign_up/VerifyOtp';
import Forgot_Password from './Forgot_Password/Forgot_Password';
import Reset_Password from './Reset_Password/Reset_Password';
import axios from 'axios';
import Question from './question/question';
import QuestionPaperDashboard from './QuestionPaperDashboard/QuestionPaperDashboard';
import Editpaper from './Edit_paper/Editpaper';
import ReadyPaperDashboard from './ReadyPaperDashboard/ReadyPaperDashboard';

import Error404 from './error/error404';
import EditQuestion from './edit_question/EditQuestion';



const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const publicRoutes = ["/sign_up", "/verify_passcode","/forgot_password","/reset_password"];
    const sessionId = localStorage.getItem("sessionId");

    // If the current route is public, skip the authentication check
    if (publicRoutes.includes(location.pathname)) {
      return;
    }

    if (sessionId) {
      axios
        .post("http://localhost:5000/teacher/verify-session", { sessionId })
        .then((response) => {
          if (response.data.valid) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("sessionId");
            setIsAuthenticated(false);
            navigate("/"); 
          }
        })
        .catch(() => {
          localStorage.removeItem("sessionId");
          setIsAuthenticated(false);
          navigate("/"); 
        });
    } else {
      setIsAuthenticated(false);
      navigate("/"); 
    }
  }, [navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/sign_up" element={<SignUp />} />
      <Route path="/verify_passcode" element={<VerifyOtp />} />
      <Route path="/forgot_password" element={<Forgot_Password />} />
      <Route path='/reset_password' element={<Reset_Password />} />

      {isAuthenticated && (
        // All protected routes should be placed here 
        <>
          <Route path="/teacherDashboard" element={<TeacherDashboard />} />
          <Route path="/create-paper" element={<Createpaper />} />
          <Route path="/edit-paper" element={<Editpaper/>} />
          <Route path="/add-question/:paperId" element={<Question />} />
          <Route path="/edit-question/:paperId/:questionId" element={<EditQuestion/>} />
          <Route path="/questionPaperDashboard/:paperId" element={<QuestionPaperDashboard />}/>
          <Route path="/ready_papers" element={<ReadyPaperDashboard />}/>
        </>
      )}



      {/* Error404 Route */}
      <Route path="/*" element={<Error404/>}/> 
    </Routes>
  );
};

const WrappedApp = () => (
  <Router>
    <App />
  </Router>
);

export default WrappedApp;
