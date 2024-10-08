import React, { useState, useEffect } from "react";
import "./CompletedNavbar.css";
import axios from "axios";
import { FaChevronLeft,
    FaChevronRight, } from "react-icons/fa";
import { useParams} from "react-router-dom";

const CompletedNavbar = () => {
  const [allotDisplay, setAllotDisplay] = useState(false);
  const { questionId } = useParams();
  const [marks, setMarks] = useState("");
  const [question,setQuestion] = useState();
  const [studentDetails, setStudentDetails] = useState([]);

  const handleMarksChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    value !== "" ? setAllotDisplay(true) : setAllotDisplay(false);
    setMarks(value);
  };

  const handleNavigation = async (direction) => {
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
            setQuestion(response.data.question);
          // Use React Router's navigate to change route
          window.location.href=`/Evaluation/${nextQuestion._id}`;
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLeft = () => {
    handleNavigation("previous");
  };

  const handleRight = () => {
    handleNavigation("next");
  };

  useEffect(() => {
    axios
      .post("http://localhost:5000/student/getStudentDetailsByStudentId", {
        studentId: JSON.parse(localStorage.getItem("response")).studentId,
      })
      .then((res) => {
        setStudentDetails(res.data.student[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <div className="completed-navbar">
        <div className="completed-nb-contents completed-nb-fullName">
          {studentDetails.fullName}
        </div>
        <div className="completed-nb-contents">
          <div className="completed-content-button completed-previous" onClick={handleLeft} disabled={!question?.previousQuestionId}>
            <FaChevronLeft />
            <div>Previous</div>
          </div>
          <div className="completed-content-button completed-student-button">
            Next Student
          </div>
          <div className="completed-content-button completed-next" onClick={handleRight} disabled={!question?.nextQuestionId}>
            <div>Next</div>
            <FaChevronRight />
          </div>
        </div>
        <div className="completed-nb-contents completed-nb-marksAllocation">
          <div className="completed-allot-marks">Allotted Marks:</div>
          <input type="tel" onChange={handleMarksChange} value={marks} />
          <div className="completed-allot-marks completed-marks">/20</div>
          {allotDisplay && <div className="completed-content-button completed-allot">Allot</div>}
        </div>
      </div>
    </>
  );
};

export default CompletedNavbar;
