import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import "./papers.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nothing from "../Assets/nothing.svg";
import { CiEdit } from "react-icons/ci";
import { HiDocumentDuplicate } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import AlertModal from "../AlertModal/AlertModal";
import Skeleton from "../Skeleton/Skeleton";

function Papers() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [reload, setReload] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [loading,setLoading] = useState(true);
  const [modalDeleteIsOpen,setModalDeleteIsOpen] = useState(false);
  const [modalDeleteMessage,setModalDeleteMessage] = useState("");

  const teacherId = localStorage.getItem("teacherId");

  useEffect(() => {

    const fetchPapers = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/paper/getPapersByTeacherId`,
          { teacherId }
        );
        setExams(response.data);
      } catch (error) {
        console.error("Error fetching papers:", error);
      }
      finally{
        setTimeout(()=>{setLoading(false)},1000);
      }
    };
    fetchPapers();
  }, [teacherId, reload]);

  const handleCreateNew = () => {
    navigate("/create-paper");
  };

  const handleEditNew = (exam) => {
    navigate("/edit-paper", {
      state: { ...exam },
    });
  };

  const deletePaper = () => {
    setModalDeleteIsOpen(true);
    setModalDeleteMessage("Do you want to delete this paper permanently?");
  };

  const deleteConfirm= async (paper) =>
  {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/paper/delete-paper`, { _id: paper._id });
      setExams((prevQuestions) => prevQuestions.filter((q) => q._id !== paper._id));
      setReload((prev) => !prev);
      setModalMessage("Paper deleted successfully.");
      setIsError(false);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error deleting paper:", error);
      setModalMessage("Failed to delete paper.");
      setIsError(true);
      setModalIsOpen(true);
    }
  }

  const duplicatePaper = async (paper) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/paper/duplicate-paper`, paper);
      setReload((prev) => !prev);
      setModalMessage("Paper duplicated successfully.");
      setIsError(false);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error duplicating paper:", error);
      setModalMessage("Failed to duplicate paper.");
      setIsError(true);
      setModalIsOpen(true);
    }
  };

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
                <FaPlus className="plus-icon-create" /> Create New
              </button>
            </div>
          </div>
          <div className="exam-table">
            {loading ? (<Skeleton exams={exams}/>) : exams.map((exam) => (
              <div
                className="papers_table"
                key={exam._id}
                onMouseEnter={() => setHoveredItem(exam._id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => {if(!modalDeleteIsOpen) handleCardClick(exam._id)}}
              >
                <AlertModal 
                        isOpen = {modalDeleteIsOpen}
                        onClose={()=>{setModalDeleteIsOpen(false)}}
                        message={modalDeleteMessage}
                        iserror={false}
                        isConfirm={true}
                        onConfirm={()=>{deleteConfirm(exam)}}
                />
                {hoveredItem === exam._id && (
                  <div className="hovered-buttons">
                    <button onClick={(e) => {
                      e.stopPropagation();
                      handleEditNew(exam);
                    }}>
                      <div className="flex-class">
                        <CiEdit />
                        <div>Edit</div>
                      </div>
                    </button>
                    <button id="duplicate" onClick={(e) => {
                      e.stopPropagation();
                      duplicatePaper(exam);
                    }}>
                      <div className="flex-class">
                        <HiDocumentDuplicate />
                        <div>Duplicate</div>
                      </div>
                    </button>
                    <button id="delete" onClick={(e) => {
                      e.stopPropagation();
                      deletePaper();
                    }}>
                      <div className="flex-class">
                        <MdDelete />
                        <div>Delete</div>
                      </div>
                      </button>

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
                    Duration : {exam.duration.hours} hours {exam.duration.minutes} mins
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
            <h2>No Paper&apos;s Found</h2>
            <button className="add-question-button" onClick={handleCreateNew}>
              <FaPlus />
              <p>Create Your First Paper</p>
            </button>
          </center>
        </div>
      )}
      <AlertModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        message={modalMessage}
        iserror={isError}
      />
    </div>
  );
}

export default Papers;
