import React, { useState, useEffect } from "react";
import "./CompletedNavbar.css";
import axios from "axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const CompletedNavbar = () => {
  const [allotDisplay, setAllotDisplay] = useState(false);
  const { questionId } = useParams();
  const [marks, setMarks] = useState("");
  const [studentDetails, setStudentDetails] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const studentId = location.state?.studentId || "";
  const studentIds = location.state?.studentIds || [];

  const currentStudentIndex = studentIds.indexOf(studentId);
  const isFirstStudent = currentStudentIndex === 0;
  const isLastStudent = currentStudentIndex === studentIds.length - 1;

  const handleMarksChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    value !== "" ? setAllotDisplay(true) : setAllotDisplay(false);
    setMarks(value);
  };

  const handleQuestionNavigation = async (direction) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/student/getCompletedQuestionNavigation",
        {
          questionId,
          direction,
        }
      );
      if (response.status === 200) {
        const nextQuestion = response.data?.question;
        if (nextQuestion && nextQuestion._id) {
          // Use navigate instead of window.location.href
          navigate(`/Evaluation/${nextQuestion._id}`, {
            state: { studentId, studentIds },
          });
        }
      }
    } catch (err) {
      console.error(err);
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
      navigate(`/Evaluation/${questionId}`, {
        state: { studentId: prevStudentId, studentIds },
      });
    }
  };

  const handleNextStudent = () => {
    if (!isLastStudent) {
      const nextStudentId = studentIds[currentStudentIndex + 1];
      navigate(`/Evaluation/${questionId}`, {
        state: { studentId: nextStudentId, studentIds },
      });
    }
  };

  useEffect(() => {
    if (studentId) {
      axios
        .post("http://localhost:5000/student/getStudentDetailsByStudentId", {
          studentId,
        })
        .then((res) => {
          setStudentDetails(res.data.student[0]);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [studentId]);

  return (
    <div className="completed-navbar">
      <div className="completed-nb-contents completed-nb-fullName">
        {studentDetails.fullName}
      </div>
      <div className="completed-nb-contents">
        {/* Question Navigation */}
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
      </div>

      <div className="completed-nb-contents">
        {/* Student Navigation */}
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
        <input type="tel" onChange={handleMarksChange} value={marks} />
        <div className="completed-allot-marks completed-marks">/20</div>
        {allotDisplay && (
          <div className="completed-content-button completed-allot">Allot</div>
        )}
      </div>
    </div>
  );
};

export default CompletedNavbar;
