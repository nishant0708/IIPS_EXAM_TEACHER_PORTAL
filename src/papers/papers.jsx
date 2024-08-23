import React, { useState } from "react";
import "./papers.css"; // Import the CSS file

function Papers() {
  const [exams] = useState([
    {
      className: "MCA 7th Sem",
      subjectName: "computer architecture",
      duration: "3 hours",
      maxMarks: 60,
    },
    {
      className: "Mtech(it) 5th sem",
      subjectName: "jawa(ic-3575875)",
      duration: "3 hours",
      maxMarks: 60,
    },
    {
      className: "Mtech(it) 3rd sem",
      subjectName: "cpp",
      duration: "3 hours",
      maxMarks: 60,
    },
  ]);

  const handleCreateNew = () => {
    alert("Create new exam item clicked!");
  };

  return (
    <div className="exam-list-container">
      <div className="header">
        <h2>Exam List</h2>
        <button className="create-new-button" onClick={handleCreateNew}>
          Create New
        </button>
      </div>
      <table className="exam-table">
        <thead>
          <tr>
            <th>Class Name</th>
            <th>Subject Name</th>
            <th>Duration</th>
            <th>Max Marks</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam, index) => (
            <tr key={index}>
              <td>{exam.className}</td>
              <td>{exam.subjectName}</td>
              <td>{exam.duration}</td>
              <td>{exam.maxMarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Papers;
