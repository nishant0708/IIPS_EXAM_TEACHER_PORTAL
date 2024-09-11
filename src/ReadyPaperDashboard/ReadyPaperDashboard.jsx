import React, { useState, useEffect } from "react";
import "../papers/papers.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nothing from "../Assets/nothing.svg";
import Navbar from "../Navbar/Navbar";
import { MdDelete } from "react-icons/md";
import AlertModal from "../AlertModal/AlertModal";
import { MdOutlineDriveFileMoveRtl } from "react-icons/md";
import Skeleton from "../Skeleton/Skeleton";

const ReadyPaperDashboard = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const teacherId = localStorage.getItem("teacherId");
  const [reload, setReload] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const getFormattedDateTime = (date, time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes);
    return dateTime.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const getDateTimeObject = (date, time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes);
    return dateTime;
  };

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
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchPapers();
  }, [teacherId, reload]);

  const handleCardClick = (paperId) => {
    navigate(`/ready_questions/${paperId}`);
  };

  const deleteReadyPaper = async (paper) => {
    try {
      const response = await axios.post(`http://localhost:5000/paper/delete-ready-paper`, { paper });
      setExams((prevQuestions) => prevQuestions.filter((q) => q._id !== paper._id));
      if (exams.length === 1) {
        setExams([]);
      }
      if (response.status === 200) {
        setModalMessage("Question Paper deleted successfully!");
        setIsError(false);
      } else {
        setModalMessage("Question paper deletion failed!");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error deleting paper:", error);
    }
    setReload((prev) => !prev);
  };

  const moveToDashboard = async (paper) => {
    try {
      const response = await axios.post("http://localhost:5000/paper/move-to-dashboard", paper);
      setExams((prevQuestions) => prevQuestions.filter((q) => q._id !== paper._id));
      if (exams.length === 1) {
        setExams([]);
      }
      if (response.status === 200) {
        setModalMessage("Your question paper has been moved to the Dashboard!");
        setIsError(false);
      } else {
        setModalMessage("Question paper move to Dashboard failed!");
        setIsError(true);
      }
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Error moving paper to dashboard:", error);
    } finally {
      setModalIsOpen(true);
    }
  };

  const oneHourRemaining = (examDate, examTime) => {
    const examDateTime = getDateTimeObject(examDate, examTime);
    const currentDateTime = new Date();
    const timeDifference = (examDateTime - currentDateTime) / (1000 * 60 * 60);
    return timeDifference > 1;
  };

  return (
    <>
      <Navbar />
      <div className="exam-list-container">
        {loading ? (
          <Skeleton exams={exams} />
        ) : exams.length > 0 ? (
          <>
            <div className="header">
              <h2>Ready Papers:</h2>
            </div>
            <center>
              <p className="readyDasboardwarning">
                The papers displayed here are ready for testing and are scheduled for the test. If you want to edit a paper, please move it to the Dashboard and resubmit it.
              </p>
            </center>
            <div className="exam-table">
              {exams.map((exam, index) => (
                <div
                  className="papers_table"
                  key={index}
                  onClick={() => handleCardClick(exam._id)}
                  onMouseEnter={() => setHoveredItem(exam._id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {hoveredItem === exam._id && (
                    <div className="hovered-buttons">
                      {oneHourRemaining(exam.date, exam.time) && (
                        <>
                        <button
                          id="move_to_dashboard"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveToDashboard(exam);
                          }}
                        >
                          <div className="flex-class">
                            <MdOutlineDriveFileMoveRtl size={22} />
                            <div>Move back to Dashboard</div>
                          </div>
                        </button>
                        <button
                        id="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteReadyPaper(exam);
                        }}
                      >
                        <div className="flex-class">
                          <MdDelete />
                          <div>Delete</div>
                        </div>
                      </button>
                        </>
                      )}
                    </div>
                  )}
                  <div className="scheduled">
                    Scheduled on: {getFormattedDateTime(exam.date, exam.time)}
                  </div>
                  <div className="table-data">
                    <div className="classhead">
                      {exam.className} {exam.semester}
                    </div>
                    <div className="subname">
                      {exam.subject} ({exam.subjectCode})
                    </div>
                    <div>
                      Duration: {exam.duration.hours} hours {exam.duration.minutes} mins
                    </div>
                    <div>Marks: {exam.marks}</div>
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
      <AlertModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} message={modalMessage} iserror={isError} />
    </>
  );
};

export default ReadyPaperDashboard;
