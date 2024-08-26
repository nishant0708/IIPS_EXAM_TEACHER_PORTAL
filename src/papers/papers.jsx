import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import "./papers.css"; 
import { useNavigate } from "react-router-dom";

function Papers() {
  const navigate = useNavigate();
  const [exams] = useState([ {
    className: "MCA 7th Sem",
    subjectName: "computer architecture(ic-1032)",
    duration: "3 hours",
    maxMarks: 60,
     scheduledOn: "30/12/24 (1:30 AM)"
  },
  {
    className: "Mtech(IT) 5th sem",
    subjectName: "java(ic-3575875)",
    duration: "3 hours",
    maxMarks: 60,
     scheduledOn: "30/12/24 (1:30 AM)"
  },
  {
    className: "Mtech(IT) 3rd sem",
    subjectName: "cpp(ic-12324)",
    duration: "3 hours",
    maxMarks: 60,
     scheduledOn: "30/12/24 (1:30 AM)"
  },]);

  const handleCreateNew = () => {
    navigate("/create-paper");
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
              <div className="papers_table" key={index}>
                <div className="scheduled">Scheduled on: {exam.scheduledOn}</div>
                <div className="table-data">
                  <div className="classhead">{exam.className}</div>
                  <div className="subname">{exam.subjectName}</div>
                  <div>Duration : {exam.duration}</div>
                  <div>Marks : {exam.maxMarks}</div>
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
