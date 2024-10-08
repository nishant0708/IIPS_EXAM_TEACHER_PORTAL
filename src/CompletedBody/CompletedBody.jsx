import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "flex-splitter-directive";
import "flex-splitter-directive/styles.min.css";
import "../Body/Body.css";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import CompletedNavbar from "../CompletedNavbar/CompletedNavbar";
import CompletedEditor from "../CompletedEditor/CompletedEditor";
import CompletedQuestionsDescription from "../CompletedQuestionDescription/CompletedQuestionsDescription";
import CompletedTest from "../CompletedTest/CompletedTest";

const CompletedBody = () => {
  const bodyContentsRef = useRef(null); // Reference for body-contents
  const [isSmallWidth, setIsSmallWidth] = useState(false); // State to track if width < 200px
  const [output, setOutput] = useState(""); // State to store the output
  const { questionId } = useParams(); // Getting questionId from the URL params
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(
    JSON.parse(localStorage.getItem("response")) || null
  ); // Retrieve response from localStorage if available
  const location = useLocation();

  // Extract studentId and paperId from location state
  const studentId = location.state?.studentId || "";
  const paperId = location.state?.paperId || "";
  const questionUrl =
    location.state?.url || "http://localhost:5000/paper/getCompletedQuestion";
  const responseUrl = "http://localhost:5000/student/getResponse";

  useEffect(() => {
    // Fetch question details
    axios
      .post(questionUrl, { questionId })
      .then((res) => {
        setQuestion(res.data.question);
      })
      .catch((err) => {
        console.error(err);
      });

    // Fetch the response by paperId and studentId if both are available
    if (paperId && studentId && !response) {
      axios
        .post(responseUrl, { paperId, studentId })
        .then((res) => {
          setResponse(res.data.response); // Store the response data
          localStorage.setItem("response", JSON.stringify(res.data.response)); // Save response to localStorage
        })
        .catch((err) => {
          console.error("Error fetching response:", err);
        });
    }

    // Resize observer
    const observer = new ResizeObserver((entries) => {
      if (bodyContentsRef.current) {
        const { width } = entries[0].contentRect;
        setIsSmallWidth(width < 200); // Set state based on width
      }
    });

    if (bodyContentsRef.current) {
      observer.observe(bodyContentsRef.current);
    }

    // Cleanup
    return () => {
      if (bodyContentsRef.current) {
        observer.unobserve(bodyContentsRef.current);
      }
      observer.disconnect();
    };
  }, [questionId, paperId, studentId, questionUrl, response]);

  return (
    <>
    {console.log(response.studentId)}
      <CompletedNavbar />
      <div className="compiler-body" data-flex-splitter-horizontal>
        <CompletedQuestionsDescription question={question} />

        <div role="separator" tabIndex="1"></div>

        {/* Conditionally render based on width */}
        {isSmallWidth ? (
          <div className="body-contents-small" ref={bodyContentsRef}>
            <p>Code</p>
          </div>
        ) : (
          <div
            className="body-contents"
            data-flex-splitter-vertical
            ref={bodyContentsRef}
          >
            <CompletedEditor question={question} onOutput={setOutput} />
            <div role="separator" tabIndex="1"></div>
            <CompletedTest output={output} response={response} />
          </div>
        )}
      </div>
    </>
  );
};

// Define prop types for the Body component
CompletedBody.propTypes = {
  question: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
  }),
};

export default CompletedBody;
