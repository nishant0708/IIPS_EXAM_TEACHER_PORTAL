import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import "./papers.css"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Papers() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]); 
  const teacherId = localStorage.getItem('teacherId'); // Assuming teacherId is stored in localStorage

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await axios.post(`http://localhost:5000/paper/getPapersByTeacherId`,{ teacherId });
        setExams(response.data);
      } catch (error) {
        console.error('Error fetching papers:', error);
      }
    };

    fetchPapers();
  }, [teacherId]);

  const handleCreateNew = () => {
    navigate("/create-paper");
  };

  const handleCardClick = (paperId) => {
    navigate(`/questionPaperDashboard/${paperId}`);
  };

  return (
    <div className="exam-list-container">
      {exams.length > 0 ? (
        <>
          <div className="header">
            <h2>Previous Papers:</h2>
            <div className="icon-button-wrapper">
              <button className="create-new-button" onClick={handleCreateNew}>
                <FaPlus className="plus-icon" /> Create New
              </button>
            </div>
          </div>
          <div className="exam-table">
            {exams.map((exam, index) => (
              <div 
                className="papers_table" 
                key={index} 
                onClick={() => handleCardClick(exam._id)}
              >
                <div className="scheduled">Scheduled on: {new Date(exam.date).toLocaleString()}</div>
                <div className="table-data">
                  <div className="classhead">{exam.className} {exam.semester}</div>
                  <div className="subname">{exam.subject} ({exam.subjectCode})</div>
                  <div>Duration : {exam.duration.hours} hours {exam.duration.minutes} mins</div>
                  <div>Marks : {exam.marks}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-papers-container">
          <h2>No Previous Papers Found</h2>
          <p>It looks like you haven&apos;t created any papers yet.</p>
          <button className="create-first-button" onClick={handleCreateNew}>
            <FaPlus className="plus-icon" /> Create Your First Paper
          </button>
        </div>
      )}
    </div>
  );
}

export default Papers;
