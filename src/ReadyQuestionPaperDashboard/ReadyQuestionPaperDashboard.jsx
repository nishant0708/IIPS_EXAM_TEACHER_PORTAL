import React from "react";
import "../QuestionPaperDashboard/QuestionPaperDashboard.css";
import Navbar from "../Navbar/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Nothing from "../Assets/nothing.svg";
import AlertModal from "../AlertModal/AlertModal";
import { useState, useEffect } from "react";
import Skeleton from "../Skeleton/Skeleton";
import { CiEdit } from "react-icons/ci";
import DOMPurify from "dompurify";
import { marked } from "marked";

const ReadyQuestionPaperDashboard = () => {
  const navigate = useNavigate();
  const { paperId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paperdetails, setpaperdetails] = useState([]);

  // State for the modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/paper/getReadyQuestionPapersByTeacherId",
          { paperId }
        );
        setQuestions(res.data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    const fetchpaperdetails = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/paper/getReadyPaperDetailsByPaperId",
          { paperId }
        );
        setpaperdetails(res.data[0]);
      } catch (error) {
        console.error("Failed to fetch paperdetails:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    fetchpaperdetails();
    fetchQuestions();
  }, [paperId]);

  const stripMarkdown = (content) => {
    const cleanHtml = DOMPurify.sanitize(marked(content));
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cleanHtml;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const editReadyQuestion = (question) => {
    navigate(`/edit-ready-question/${question.paperId}/${question._id}`, {
      state: { ...question },
    });
  };
  return (
    <>
      <Navbar />
      <div className="question-list-container">
        {loading ? (
          <Skeleton exams={questions} />
        ) : questions.length > 0 ? (
          <>
            <div className="question-header">
              <div className="ready-question-display-flex">
                <h2 className="question-subject">
                  {paperdetails.className} {paperdetails.semester} (
                  {paperdetails.subject})
                </h2>
                <h2>Total Marks: {paperdetails.marks}</h2>
              </div>
            </div>
            <div className="question-table">
              {questions.map((question) => (
                <div
                  className="questions-table"
                  key={question._id}
                  onMouseEnter={() => setHoveredItem(question._id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => {
                    navigate(`/preview/${question._id}`);
                  }}
                >
                  {hoveredItem === question._id && (
                    <div className="hovered-buttons">
                      <button onClick={(e) => {e.stopPropagation();editReadyQuestion(question)}}>
                        <div className="flex-class">
                          <CiEdit />
                          <div>Edit</div>
                        </div>
                      </button>
                    </div>
                  )}
                  <div className="question-table-data">
                    <div className="compiler">
                      Compiler: {question.compilerReq}
                    </div>
                    <div className="marks">Marks: {question.marks}</div>
                    <div className="heading-description">
                      <h3 className="question_paper_h3">
                        {question.questionheading}
                      </h3>
                      <div className="description">
                        {stripMarkdown(question.questionDescription)}
                      </div>
                    </div>
                    {question.image ? (
                      <div className="question-image">
                        <img src={question.image} alt="question" />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="no-questions-container">
              <center>
                <img alt="Nothing" src={Nothing} className="nothing" />
                <h2>No Ready Questions Found</h2>
              </center>
            </div>
          </>
        )}
      </div>

      {/* Alert Modal */}
      <AlertModal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
    </>
  );
};

export default ReadyQuestionPaperDashboard;
