import React, { useState, useEffect } from "react";
import "../papers/papers.css";
import Nothing from "../Assets/nothing.svg";
import Navbar from "../Navbar/Navbar";
import Skeleton from "../Skeleton/Skeleton";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import image from "../Assets/profile_photo.png";

const CompletedPaperStudentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { paperId } = useParams();
  const evaluations = ["Evaluated", "Not-Evaluated", "Evaluation-in-Progress"];
  const [studentIds, setStudentIds] = useState([]);
  const [questionId, setQuestionId] = useState(null); // State to store questionId
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Fetch students based on paperId
    axios
      .post("http://localhost:5000/student/getStudentByPaperId", { paperId })
      .then((res) => {
        setStudents(res.data.students);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });

    // Fetch the first completed question ID for the paper
    axios
      .post("http://localhost:5000/student/getFirstCompletedQuestionByPaperId", { paperId })
      .then((res) => {
        setQuestionId(res.data.question._id); // Store the question ID in state
      })
      .catch((err) => {
        console.error("Error fetching first question:", err);
      });

    // Fetch student IDs who have completed the paper
    axios
      .post("http://localhost:5000/paper/getCompletedPaperByPaperId", { paperId })
      .then((res) => {
        setStudentIds(res.data.students);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [paperId]);

  // Function to get the attemption status
  const getAttemptionStatus = (studentId) => {
    return studentIds.indexOf(studentId) === -1 ? "Not-Attempted" : "Attempted";
  };

  // Function to handle card click
  const handleCardClick = (studentId) => {
    if (questionId) {
      navigate(`/Evaluation/${questionId}`, { 
        state: { studentId, paperId }  // Correctly pass both studentId and paperId in a single state object
      });
    } else {
      console.error("Question ID not found.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="exam-list-container">
        {loading ? (
          <Skeleton exams={students} />
        ) : students.length > 0 ? (
          <>
            <div className="header">
              <h2>Students:</h2>
            </div>
            <div className="exam-table">
              {students.map((student, index) => {
                const attemption = getAttemptionStatus(student._id);
                return (
                  <div
                    className="papers_table"
                    key={index}
                    onClick={() => handleCardClick(student._id)} // Handle click
                  >
                    <div className="table-data completed-student">
                      <div className="evaluation-attemption">
                        <div className={`evaluation ${evaluations[index % 3]}`}>
                          <GoDotFill />
                          <div>
                            {evaluations[index % 3]}&nbsp;
                            {evaluations[index % 3] === "Evaluated" && (
                              <>Alloted Marks: 20</>
                            )}
                          </div>
                        </div>
                        <div className={`attemption ${attemption}`}>
                          {attemption === "Attempted" ? (
                            <>
                              <FaCheck />
                              <div>Attempted</div>
                            </>
                          ) : (
                            <>
                              <ImCross />
                              <div>Not Attempted</div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="student-image-name">
                        <div className="student-image">
                          <img src={image} alt="Image" />
                        </div>
                        <div className="student-name">
                          <div className="classhead">{student.fullName}</div>
                          <div className="subname">Email: &nbsp;{student.email}</div>
                          <div className="subname">{student.rollNumber}</div>
                          <div className="subname">{student.phoneNumber}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="no-questions-container">
            <center>
              <img alt="Nothing" src={Nothing} className="nothing" />
              <h2>No Students Found</h2>
            </center>
          </div>
        )}
      </div>
    </>
  );
};

export default CompletedPaperStudentDashboard;
