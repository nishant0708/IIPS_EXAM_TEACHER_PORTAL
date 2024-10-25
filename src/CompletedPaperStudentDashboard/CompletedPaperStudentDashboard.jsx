import React, { useState, useEffect } from "react";
import "../papers/papers.css";
import Nothing from "../Assets/nothing.svg";
import Navbar from "../Navbar/Navbar";
import Skeleton from "../Skeleton/Skeleton";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import image from "../Assets/profile_photo.png";
import { PiExport } from "react-icons/pi";

const CompletedPaperStudentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmails, setSendingEmails] = useState(false); // Loading state for sending emails
  const { paperId } = useParams();
  const [evaluationStatus, setEvaluationStatus] = useState({});
  const [completedStudentIds, setCompletedStudentIds] = useState([]);
  const [questionId, setQuestionId] = useState(null);

  useEffect(() => {
    axios
      .post("http://localhost:5000/student/getStudentByPaperId", { paperId })
      .then((res) => {
        const sortedStudents = res.data.students.sort((a, b) =>
          a.fullName.localeCompare(b.fullName)
        );
        setStudents(sortedStudents);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });

    axios
      .post("http://localhost:5000/student/getFirstCompletedQuestionByPaperId", {
        paperId,
      })
      .then((res) => {
        setQuestionId(res.data.question._id);
      })
      .catch((err) => {
        console.error("Error fetching first question:", err);
      });

    axios
      .post("http://localhost:5000/paper/getCompletedPaperByPaperId", {
        paperId,
      })
      .then((res) => {
        setCompletedStudentIds(res.data.students);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [paperId]);

  useEffect(() => {
    students.forEach((student) => {
      axios
        .post("http://localhost:5000/paper/evaluate_status", {
          studentId: student._id,
          paperId: paperId,
        })
        .then((res) => {
          setEvaluationStatus((prevStatus) => ({
            ...prevStatus,
            [student._id]: {
              status: res.data.status,
              totalMarks: res.data.totalMarks || "N/A",
            },
          }));
        })
        .catch((err) => {
          console.error(`Error fetching evaluation for student ${student._id}:`, err);
        });
    });
  }, [students, paperId]);

  const getAttemptionStatus = (studentId) => {
    return completedStudentIds.includes(studentId) ? "Attempted" : "Not-Attempted";
  };

  // Sort students by attempted status and then alphabetically within each group
  const sortedStudents = students.slice().sort((a, b) => {
    const aStatus = getAttemptionStatus(a._id);
    const bStatus = getAttemptionStatus(b._id);

    if (aStatus === bStatus) return a.fullName.localeCompare(b.fullName);
    return aStatus === "Attempted" ? -1 : 1;
  });

  // Check if all attempted students are evaluated
  const allAttemptedEvaluated = sortedStudents
    .filter((student) => getAttemptionStatus(student._id) === "Attempted")
    .every((student) => evaluationStatus[student._id]?.status === "Evaluated");

  const handleCardClick = (studentId) => {
    if (questionId) {
      const attemptedStudentIds = sortedStudents
        .filter((student) => getAttemptionStatus(student._id) === "Attempted")
        .map((student) => student._id);

      localStorage.setItem("studentId", studentId);
      localStorage.setItem("paperId", paperId);
      localStorage.setItem("studentIds", JSON.stringify(attemptedStudentIds));
      window.location.href = `/Evaluation/${questionId}`;
    } else {
      console.error("Question ID not found.");
    }
  };

  // Function to send results email to students
  const sendMailToStudents = () => {
    setSendingEmails(true); // Start loading state
    axios
      .post("http://localhost:5000/paper/sendmailtostudent", {
        paperId,
        students,
        evaluationStatus,
      })
      .then((res) => {
        console.log("Emails sent successfully:", res.data);
      })
      .catch((err) => {
        console.error("Error sending emails:", err);
      })
      .finally(() => {
        setSendingEmails(false); // End loading state
      });
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
              {allAttemptedEvaluated && (
                <div className="export_completed_paper_buttons_div">
                  <button className="export_completed_paper_buttons">
                    <PiExport /> Export Excel
                  </button>
                  <button
                    className="export_completed_paper_buttons"
                    onClick={sendMailToStudents}
                    disabled={sendingEmails}
                  >
                    {sendingEmails ? "Sending Emails..." : "Send Result to Students"}
                  </button>
                </div>
              )}
            </div>
            <div className="exam-table">
              {sortedStudents.map((student, index) => {
                const attemption = getAttemptionStatus(student._id);
                const evalInfo = evaluationStatus[student._id] || {};
                const evalStatus = evalInfo.status || "Not Evaluated";

                // Define color based on evaluation status
                const evalColor =
                  evalStatus === "Evaluated"
                    ? "green"
                    : evalStatus === "Evaluation in Progress"
                    ? "yellow"
                    : "red";

                return (
                  <div
                    className="papers_table"
                    key={index}
                    onClick={attemption === "Attempted" ? () => handleCardClick(student._id) : null}
                    style={{
                      cursor: attemption === "Attempted" ? "pointer" : "not-allowed",
                    }}
                  >
                    <div className="table-data completed-student">
                      <div className="evaluation-attemption">
                        <div
                          className={`evaluation ${evalStatus.toLowerCase().replace(/ /g, "-")}`}
                          style={{ color: evalColor }}
                        >
                          <GoDotFill />
                          <div className="completed_student_dashboard_evaluation">
                            {evalStatus}&nbsp;
                            {evalStatus === "Evaluated" && (
                              <>Alloted Marks: {evalInfo.totalMarks}</>
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
