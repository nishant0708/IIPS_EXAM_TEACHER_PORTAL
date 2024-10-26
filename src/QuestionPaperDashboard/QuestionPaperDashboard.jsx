import React, { useState, useEffect } from "react";
import "./QuestionPaperDashboard.css";
import Navbar from "../Navbar/Navbar";
import { FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Nothing from "../Assets/nothing.svg";
import AlertModal from "../AlertModal/AlertModal";
import DOMPurify from "dompurify";
import { marked } from "marked";

import { CiEdit } from "react-icons/ci";
import { HiDocumentDuplicate } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import Skeleton from "../Skeleton/Skeleton";

const QuestionPaperDashboard = () => {
  const navigate = useNavigate();
  const { paperId } = useParams();
  const [reload, setReload] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paperdetails, setpaperdetails] = useState([]);

  // State for the modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    document.title = "Question-paper-Dashboard";
    const fetchQuestions = async () => {
      try {
        const res = await axios.post(
          "iipsonlineexambackend-production.up.railway.app/paper/questionsbyid",
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
          "iipsonlineexambackend-production.up.railway.app/paper/getPapersdetails",
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
  }, [paperId, reload]);

  const totalMarks = questions.reduce(
    (sum, question) => sum + question.marks,
    0
  );

  const stripMarkdown = (content) => {
    console.log(content);
    const cleanHtml = DOMPurify.sanitize(marked(content));
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cleanHtml;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const deleteQuestion = async (question) => {
    try {
      const response = await axios.post(
        "iipsonlineexambackend-production.up.railway.app/paper/delete-question",
        { _id: question._id }
      );
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q._id !== question._id)
      );

      if (questions.length === 1) {
        setQuestions([]);
      }

      if (response.status === 200) {
        setModalMessage("Question deleted successfully!");
        setIsError(false);
        setModalIsOpen(true);
      } else {
        setModalMessage("Question deleted failed!");
        setIsError(true);
        setModalIsOpen(true);
      }

      setReload((prev) => !prev);
    } catch (error) {
      console.error("Error creating paper:", error);
    }
  };

  const duplicateQuestion = async (question) => {
    console.log(question);
    const response = await axios.post(
      `iipsonlineexambackend-production.up.railway.app/paper/duplicate-question`,
      { question }
    );
    if (response.status === 201) {
      setModalMessage("Question duplicated successfully!");
      setIsError(false);
      setModalIsOpen(true);
    } else {
      setModalMessage("Question duplication failed!");
      setIsError(true);
      setModalIsOpen(true);
    }
    setReload((prev) => !prev);
  };

  const editQuestion = (question) => {
    const remainingMarks = paperdetails.marks - totalMarks + question.marks; // Calculate remaining marks considering the current question's marks
    navigate(`/edit-question/${question.paperId}/${question._id}`, {
      state: {
        ...question,
        remainingMarks, // Pass remaining marks to the EditQuestion component
      },
    });
  };
  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "iipsonlineexambackend-production.up.railway.app/paper/submitpaper",
        { paperId }
      );

      if (response.data.success) {
        setModalMessage("Your question paper has been submitted successfully!");
        setIsError(false);
        setTimeout(() => {
          navigate("/ready_papers");
        }, 2000);
      } else {
        setModalMessage(response.data.message || "Failed to submit the paper.");
        setIsError(true);
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to submit the paper.";

      setModalMessage(errorMessage);
      setIsError(true);
    } finally {
      // Open the modal regardless of the outcome
      setModalIsOpen(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="question-list-container">
        {questions.length > 0 ? (
          <>
            <div className="question-header">
              <h2 className="question-subject">
                {paperdetails.className} {paperdetails.semester} (
                {paperdetails.subject})
              </h2>
              <h2 className="question-total-marks">
                Total Marks: &nbsp;{totalMarks}/{paperdetails.marks}
              </h2>
            </div>
            {totalMarks > paperdetails.marks && (
              <div className="error_message_questionDashboard">
                <p>
                  The total marks ({totalMarks}) exceed the allowed marks (
                  {paperdetails.marks}). Please remove{" "}
                  <strong>{totalMarks - paperdetails.marks}</strong> marks to
                  submit the paper.
                </p>
              </div>
            )}
            <div className="question-table">
              {loading ? (
                <Skeleton exams={questions} />
              ) : (
                questions.map((question) => (
                  <div
                    className="questions-table"
                    key={question._id}
                    onMouseEnter={() => setHoveredItem(question._id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => {
                      navigate(`/preview/${question._id}`,
                        {state:
                          {
                            url: "iipsonlineexambackend-production.up.railway.app/paper/getQuestionsDetailsByQuestionId"
                          }
                        }
                      );
                    }}
                  >
                    {hoveredItem === question._id && (
                      <div className="hovered-buttons">
                        <button onClick={(e) => 
                          {
                            e.stopPropagation();
                            editQuestion(question)}}>
                          <div className="flex-class">
                            <CiEdit />
                            <div>Edit</div>
                          </div>
                        </button>
                        <button
                          id="duplicate"
                          onClick={(e) => {e.stopPropagation();duplicateQuestion(question)}}
                        >
                          <div className="flex-class">
                            <HiDocumentDuplicate />
                            <div>Duplicate</div>
                          </div>
                        </button>
                        <button
                          id="delete"
                          onClick={(e) => {e.stopPropagation();deleteQuestion(question)}}
                        >
                          <div className="flex-class">
                            <MdDelete />
                            <div>Delete</div>
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
                ))
              )}

              <center>
                {totalMarks < paperdetails.marks && (
                  <button
                    className="add-question-button2"
                    onClick={() =>
                      navigate(`/add-question/${paperId}`, {
                        state: {
                          remainingMarks: paperdetails.marks - totalMarks,
                        },
                      })
                    }
                  >
                    <FaPlus />
                    <p>Add Question</p>
                  </button>
                )}
                {totalMarks === paperdetails.marks && (
                  <button
                    className="question_submit-button"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                )}
              </center>
            </div>
          </>
        ) : (
          <>
            <div className="no-questions-container">
              <center>
                <img alt="Nothing" src={Nothing} className="nothing" />
                <h2>No Questions Found</h2>
                <button
                  className="add-question-button"
                  onClick={() =>
                    navigate(`/add-question/${paperId}`, {
                      state: {
                        remainingMarks: paperdetails.marks - totalMarks,
                      },
                    })
                  }
                >
                  <FaPlus />
                  <p>Create Your First Question</p>
                </button>
              </center>
            </div>
          </>
        )}
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        message={modalMessage}
        iserror={isError}
      />
    </>
  );
};

export default QuestionPaperDashboard;
