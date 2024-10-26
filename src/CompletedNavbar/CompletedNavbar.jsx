import React, { useState, useEffect } from "react";
import "./CompletedNavbar.css";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import AlertModal from "../AlertModal/AlertModal"; // Importing AlertModal

const CompletedNavbar = () => {
  const [allotDisplay, setAllotDisplay] = useState(false);
  const [isEditable, setIsEditable] = useState(false); // State to toggle editability
  const { questionId } = useParams();
  const [marks, setMarks] = useState("");
  const [questionMaxMarks, setQuestionMaxMarks] = useState(""); // State for question max marks
  const [studentDetails, setStudentDetails] = useState({});
  const [response, setResponse] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to control modal visibility
  const [modalMessage, setModalMessage] = useState("");

  const studentId = localStorage.getItem("studentId") || "";
  const studentIds = JSON.parse(localStorage.getItem("studentIds")) || [];
  const paperId = localStorage.getItem("paperId") || "";

  const currentStudentIndex = studentIds.indexOf(studentId);
  const isFirstStudent = currentStudentIndex === 0;
  const isLastStudent = currentStudentIndex === studentIds.length - 1;

  const handleMarksChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAllotDisplay(value !== marks); // Show "Allot" button only if value is changed
    setMarks(value);
  };

  const handleEditMarks = () => {
    setIsEditable(true); // Enable editing on click
    setAllotDisplay(false); // Hide the allot button until marks change
  };

  const handleQuestionNavigation = async (direction) => {
    try {
      const response = await axios.post(
        "iipsonlineexambackend-production.up.railway.app/student/getCompletedQuestionNavigation",
        { questionId, direction }
      );
      if (response.status === 200) {
        const nextQuestion = response.data?.question;
        if (nextQuestion && nextQuestion._id) {
          window.location.href = `/Evaluation/${nextQuestion._id}`;
        }
      }
    } catch (err) {
      console.error("Error navigating question:", err);
    }
  };

  const handleLeftQuestion = () => {
    handleQuestionNavigation("previous");
  };

  const handleRightQuestion = () => {
    handleQuestionNavigation("next");
  };

  const handlePreviousStudent = () => {
    if (!isFirstStudent) {
      const prevStudentId = studentIds[currentStudentIndex - 1];
      localStorage.setItem("studentId", prevStudentId);
      window.location.href = `/Evaluation/${questionId}`;
    }
  };

  const handleNextStudent = () => {
    if (!isLastStudent) {
      const nextStudentId = studentIds[currentStudentIndex + 1];
      localStorage.setItem("studentId", nextStudentId);
      window.location.href = `/Evaluation/${questionId}`;
    }
  };

  const handleAllotMarks = async () => {
    try {
      const response = await axios.post(
        "iipsonlineexambackend-production.up.railway.app/student/allocateMarks",
        {
          paperId,
          studentId,
          questionId,
          marks: Number(marks ?? 0),
        }
      );
      if (response.status === 200) {
        setModalMessage("Marks allocated successfully");
        setModalIsOpen(true); // Open modal on successful allocation
        setIsEditable(false); // Disable input after successful allotment
      }
    } catch (err) {
      console.error("Error allocating marks:", err);
      setModalMessage(
        "Failed" + " " + err?.response?.data?.message ||
          "Error Failed allocating marks"
      );
      setModalIsOpen(true); // Open modal on error
    }
  };

  const handleModalConfirm = async () => {
    if (!modalMessage.includes("Failed")) {
      try {
        // Check if a next question exists
        const response = await axios.post(
          "iipsonlineexambackend-production.up.railway.app/student/getCompletedQuestionNavigation",
          { questionId, direction: "next" }
        );
        const nextQuestion = response.data?.question;

        if (nextQuestion && nextQuestion._id) {
          // Navigate to the next question if it exists
          window.location.href = `/Evaluation/${nextQuestion._id}`;
        } else if (!isLastStudent) {
          // If no next question, but there is a next student, move to the next student
          handleNextStudent();
        } else {
          // If no next question or next student, go to completed papers
          window.location.href = `/completed_papers_student/${paperId}`;
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.warn("No next question found; checking for next student.");
          if (!isLastStudent) {
            handleNextStudent();
          } else {
            window.location.href = `/completed_papers_student/${paperId}`;
          }
        } else {
          console.error(
            "Error navigating to the next question or student:",
            err
          );
        }
      }
    }
    // Close the modal
    setModalIsOpen(false);
  };

  useEffect(() => {
    if (studentId) {
      axios
        .post("iipsonlineexambackend-production.up.railway.app/student/getStudentDetailsByStudentId", {
          studentId,
        })
        .then((res) => {
          setStudentDetails(res.data.student[0]);
        })
        .catch((err) => {
          console.error("Error fetching student details:", err);
        });
    }
  }, [studentId]);

  useEffect(() => {
    if (paperId && studentId) {
      axios
        .post("iipsonlineexambackend-production.up.railway.app/student/getResponse", {
          paperId,
          studentId,
        })
        .then((res) => {
          setResponse(res.data.response);
          console.log(response);
          const currentQuestion = res.data.response.questions.find(
            (q) => q.questionId === questionId
          );
          if (currentQuestion) {
            if (currentQuestion.marks === null) {
              // If marks are null, make the input editable and show the Allot button
              setIsEditable(true);
              setAllotDisplay(true);
            } else {
              // If marks exist, display them and hide the Allot button initially
              setMarks(currentQuestion.marks);
              setIsEditable(false);
              setAllotDisplay(false);
            }
          }
        })
        .catch((err) => {
          console.error("Error fetching response:", err);
        });
    }
  }, [paperId, studentId, questionId]);

  useEffect(() => {
    if (questionId) {
      axios
        .post("iipsonlineexambackend-production.up.railway.app/paper/getCompletedQuestion", {
          questionId,
        })
        .then((res) => {
          setQuestionMaxMarks(res.data.question.marks); // Set question max marks
        })
        .catch((err) => {
          console.error("Error fetching question details:", err);
        });
    }
  }, [questionId]);

  return (
    <div className="completed-navbar">
      <div
        className={`completed-content-button completed-previous-student completed-student-button`}
        onClick={() => {
          window.location.href = `/completed_papers_student/${paperId}`;
        }}
      >
        <FaChevronLeft />
        <div>Back</div>
      </div>
      <div className="completed-nb-contents completed-nb-fullName">
        {studentDetails.fullName}
      </div>

      <div className="completed-nb-contents completed-navigation">
        <div
          className={`completed-content-button completed-previous-student completed-student-button${
            isFirstStudent ? " disabled" : ""
          }`}
          onClick={handlePreviousStudent}
        >
          <FaChevronLeft />
          <div>Previous Student</div>
        </div>

        <div
          className="completed-content-button completed-previous"
          onClick={handleLeftQuestion}
        >
          <FaChevronLeft />
          <div>Previous Question</div>
        </div>

        <div
          className="completed-content-button completed-next"
          onClick={handleRightQuestion}
        >
          <div>Next Question</div>
          <FaChevronRight />
        </div>

        <div
          className={`completed-content-button completed-next-student completed-student-button${
            isLastStudent ? " disabled" : ""
          }`}
          onClick={handleNextStudent}
        >
          <div>Next Student</div>
          <FaChevronRight />
        </div>
      </div>

      <div className="completed-nb-contents completed-nb-marksAllocation">
        <div className="completed-allot-marks">Allotted Marks:</div>
        <input
          type="tel"
          onChange={handleMarksChange}
          value={marks}
          disabled={!isEditable} // Disable input if not editable
        />
        <div className="completed-allot-marks completed-marks">
          /{questionMaxMarks}
        </div>

        {allotDisplay && (
          <div
            className="completed-content-button completed-allot"
            onClick={handleAllotMarks}
          >
            Allot
          </div>
        )}
        {!allotDisplay && !isEditable && marks !== "" && marks !== null && (
          <div
            className="completed-content-button completed-edit"
            onClick={handleEditMarks}
          >
            Edit
          </div>
        )}
      </div>

      <AlertModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        onConfirm={handleModalConfirm}
        message={modalMessage}
        iserror={modalMessage.includes("Failed")}
      />
    </div>
  );
};

export default CompletedNavbar;
