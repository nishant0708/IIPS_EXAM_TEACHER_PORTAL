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
import image from  "../Assets/profile_photo.png";

const CompletedPaperStudentDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { paperId } = useParams();
  const evaluations = ["Evaluated", "Not-Evaluated", "Evaluation-in-Progress"];
  const attemptions = ["Attempted", "Not-Attempted"];

  useEffect(() => {
    axios
      .post("http://localhost:5000/student/getStudentByPaperId", {
        paperId,
      })
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
  }, []);
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
              {students.map((student, index) => (
                <div
                  className="papers_table"
                  key={index}
                  //   onClick={() => handleCardClick(student._id)}
                  //   onMouseEnter={() => setHoveredItem(paper._id)}
                  //   onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Since delete and move features are removed, no buttons are shown */}
                  {/* <div className="scheduled">
                    Completed on: {getFormattedDateTime(paper.endTime, paper.time)}
                  </div> */}
                  <div className="table-data">
                    <div className="evaluation-attemption">
                      <div className={`evaluation ${evaluations[0]}`}>
                        <GoDotFill />
                        <div>{evaluations[0]}</div>
                      </div>
                      <div className={`attemption ${attemptions[0]}`}>
                        {attemptions[0] === "Attempted" ? (
                          <>
                            <FaCheck />
                            <div>Attempted</div>
                          </>
                        ) : (
                          <>
                            {attemptions[0] === "Not-Attempted" ? (
                              <>
                                <ImCross />
                                <div>Not Attempted</div>
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="student-image-name">
                        <div className="student-image">
                            <img src={image} alt="Image"/>
                        </div>
                        <div className="student-name">
                            <div className="classhead">{student.fullName}</div>
                            <div className="subname">Email: &nbsp;{student.email}</div>
                            <div className="subname">{student.rollNumber}</div>
                        </div>
                    </div>
                    {/* <div className="subname">
                      {student.subject} ({student.subjectCode})
                    </div>
                    <div>
                      Duration: {student.duration.hours} hours{" "}
                      {student.duration.minutes} mins
                    </div>
                    <div>Marks: {student.marks}</div> */}
                  </div>
                </div>
              ))}
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
      {/* <AlertModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        message={modalMessage}
        iserror={isError}
      /> */}
    </>
  );
};

export default CompletedPaperStudentDashboard;
