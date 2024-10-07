
import React, { useState, useEffect } from "react";
import "../papers/papers.css"; 
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nothing from "../Assets/nothing.svg";
import Navbar from "../Navbar/Navbar";
import Skeleton from "../Skeleton/Skeleton";
import { GoDotFill } from "react-icons/go";
import { useNavigate } from "react-router-dom";
// import AlertModal from "../AlertModal/AlertModal";

const CompletedPaperDashboard = () => {
  const navigate = useNavigate();
  const [completedPapers, setCompletedPapers] = useState([]);
//   const [hoveredItem, setHoveredItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const evaluations=[
    "Evaluated",
    "Not-Evaluated",
    "Evaluation-in-Progress",
  ];

  const teacherId = localStorage.getItem("teacherId");
//   const [reload, setReload] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [isError, setIsError] = useState(false);
//   const [modalIsOpen, setModalIsOpen] = useState(false);

const getFormattedDateTime = (date, time) => {
    if (!date || !time) {
      return "Invalid Date or Time"; // Or handle it however you want
    }

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

  useEffect(() => {
    const fetchCompletedPapers = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/paper/getCompletedPapersByTeacherId`,
          { teacherId }
        );
        setCompletedPapers(response.data);
      } catch (error) {
        console.error("Error fetching completed papers:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchCompletedPapers();
  }, [teacherId]);

  const handleCardClick = (paperId) => {
    // navigate(`/completed_questions/${paperId}`);
    navigate(`/completed_papers_student/${paperId}`);
  };

  return (
    <>
      <Navbar />
      <div className="exam-list-container">
        {loading ? (
          <Skeleton exams={completedPapers} />
        ) : completedPapers.length > 0 ? (
          <>
            <div className="header">
              <h2>Completed Papers:</h2>
            </div>
            <center>
              <p className="readyDasboardwarning">
                The papers displayed here are completed and have been processed. You can view the details of each paper by clicking on them.
              </p>
            </center>
            <div className="exam-table">
              {completedPapers.map((paper, index) => (
                <div
                  className="papers_table"
                  key={index}
                  onClick={() => handleCardClick(paper._id)}
                //   onMouseEnter={() => setHoveredItem(paper._id)}
                //   onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Since delete and move features are removed, no buttons are shown */}
                  <div className="scheduled">
                    Completed on: {getFormattedDateTime(paper.endTime, paper.time)}
                  </div>
                  <div className="table-data">
                    <div className={`evaluation ${evaluations[0]}`}>
                      <GoDotFill />
                      <div>{evaluations[0]}</div>
                    </div>
                    <div className="classhead">
                      {paper.className} {paper.semester}
                    </div>
                    <div className="subname">
                      {paper.subject} ({paper.subjectCode})
                    </div>
                    <div>
                      Duration: {paper.duration.hours} hours {paper.duration.minutes} mins
                    </div>
                    <div>Marks: {paper.marks}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-questions-container">
            <center>
              <img alt="Nothing" src={Nothing} className="nothing" />
              <h2>No Completed Papers Found</h2>
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

export default CompletedPaperDashboard;
