import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import "./papers.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nothing from "../Assets/nothing.svg";

function Papers() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [reload,setReload]= useState(false);

  const teacherId = localStorage.getItem("teacherId"); // Assuming teacherId is stored in localStorage

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/paper/getPapersByTeacherId`,
          { teacherId }
        );
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
    };

    fetchPapers();
  }, [teacherId,reload]);

  const handleCreateNew = () => {
    navigate("/create-paper");
  };

  const handleEditNew=(exam)=>
  {
    navigate(
      "/edit-paper",
      {
        state:
        {
          _id:exam._id,
          className:exam.className,
          semester:exam.semester,
          subject:exam.subject,
          subjectCode:exam.subjectCode,
          date:exam.date,
          duration:exam.duration,
          testType:exam.testType,
          marks:exam.marks,
          time:exam.time
        }
      }
    );
  }


  const deletePaper=async (paper)=>
  {

    try
    {
      await axios.post('http://localhost:5000/paper/delete-paper', { _id: paper._id })
      setExams((prevQuestions) => prevQuestions.filter(q => q._id !== paper._id));
    
      if (paper.length === 1) {
        setExams([]); 
      }

      setReload(prev => !prev);
  
    }
    catch(error)
    {
      console.error('Error creating paper:', error);
    }
  }

  const duplicatePaper = async (paper)=>
  {
    await axios.post("http://localhost:5000/paper/duplicate-paper",paper);
    setReload(prev => !prev);
  }


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

  const handleCardClick = (paperId, exam) => {
    navigate(`/questionPaperDashboard/${paperId}`, {
      state: {
        className: exam.className,
        semester: exam.semester,
        subject: exam.subject,
        marks: exam.marks,
      },
    });
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
                onClick={() => handleCardClick(exam._id, exam)} // Passing exam data to handleCardClick
              >
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
                    Duration : {exam.duration.hours} hours{" "}
                    {exam.duration.minutes} mins
                  </div>
                  <div>Marks : {exam.marks}</div>
                  <button style={{width:"300px"}} onClick={(e)=>
                    {
                      e.stopPropagation();
                      handleEditNew(exam);
                    }}>
                      Edit
                  </button>
                  <button style={{width:"300px"}} onClick={
                    (e)=>
                    {
                      e.stopPropagation();
                      deletePaper(exam);
                    }
                  }>
                    Delete
                  </button>
                  <button onClick={(e)=>
                    {
                      e.stopPropagation();
                      duplicatePaper(exam);

                    }} style={{width:"300px"}}>
                    Duplicate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-questions-container">
              <center>
                <img alt="Nothing" src={Nothing} className="nothing" />
                <h2>No Paper&apos;s Found</h2>
                <button
                  className="add-question-button"
                  onClick={handleCreateNew}
                >
                  <FaPlus />
                  <p>Create Your First Paper</p>
                </button>
              </center>
            </div>
      )}
    </div>
  );
}

export default Papers;
