import React, { useState, useEffect } from "react";
import "../papers/papers.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nothing from "../Assets/nothing.svg";
import Navbar from "../Navbar/Navbar";

const ReadyPaperDashboard = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  
  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/paper/getReadyPapersByTeacherId`,
          { teacherId }
        );
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };

    fetchPapers();
  }, [teacherId]);

  const handleCardClick = (paperId) => {
    navigate(`/questionPaperDashboard/${paperId}`);
  };

  return (
    <>
      <Navbar />
      <div className="exam-list-container">
        {exams.length > 0 ? (
          <>
            <div className="header">
              <h2>Ready Papers:</h2>
            </div>
            <div className="exam-table">
              {exams.map((exam, index) => (
                <div
                  className="papers_table"
                  key={index}
                  onClick={() => handleCardClick(exam._id)} 
                >
                  <div className="scheduled">
                    Scheduled on: {new Date(exam.date).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </div>
                  <div className="table-data">
                    <div className="classhead">
                      {exam.className} {exam.semester}
                    </div>
                    <div className="subname">
                      {exam.subject} ({exam.subjectCode})
                    </div>
                    <div>
                      Duration : {exam.duration.hours} hours{" "}
                      {exam.duration.minutes} mins
                    </div>
                    <div>Marks : {exam.marks}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-questions-container">
            <center>
              <img alt="Nothing" src={Nothing} className="nothing" />
              <h2>No Ready Papers Found</h2>
            </center>
          </div>
        )}
      </div>
    </>
  );
}

export default ReadyPaperDashboard;
