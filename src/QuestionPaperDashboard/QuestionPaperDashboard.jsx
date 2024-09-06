import React, { useState, useEffect } from "react";
import "./QuestionPaperDashboard.css";
import Navbar from "../Navbar/Navbar";
import { FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import defaultImage from "../Assets/no-image-420x370-1.jpg";
import Nothing from "../Assets/nothing.svg";
import AlertModal from "../AlertModal/AlertModal";


const QuestionPaperDashboard = () => {


  const navigate = useNavigate();
  const { paperId } = useParams();
  const [reload,setReload]= useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paperdetails,setpaperdetails]=useState([]);
  
  // State for the modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/paper/questionsbyid",
          { paperId }
        );
        setQuestions(res.data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
       
       
      } finally {
        setLoading(false);
      }
    };
    const fetchpaperdetails = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/paper/getPapersdetails",
          { paperId }
        );
        setpaperdetails(res.data[0]);
      } catch (error) {
        console.error("Failed to fetch paperdetails:", error);
       
       
      } finally {
        setLoading(false);
      }
    };
  fetchpaperdetails();
    fetchQuestions();
  }, [paperId,reload]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalMarks = questions.reduce(
    (sum, question) => sum + question.marks,
    0
  );


  const deleteQuestion=async (question)=>
    {
      console.log(question);
      try
      {
        await axios.post('http://localhost:5000/paper/delete-question', { _id: question._id })
        setQuestions((prevQuestions) => prevQuestions.filter(q => q._id !== question._id));
    
        if (questions.length === 1) {
          setQuestions([]); 
        }

        setReload(prev => !prev);
      }
      catch(error)
      {
        console.error('Error creating paper:', error);
      }
    }

    const duplicateQuestion= async (question)=>
    {
      console.log(question);
      await axios.post(`http://localhost:5000/paper/duplicate-question`, { question})
      setReload(prev => !prev);

    }
    const handleSubmit = async () => {
      try {
    
        const response = await axios.post("http://localhost:5000/paper/submitpaper", { paperId });
    

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
                {paperdetails.className} {paperdetails.semester} ({paperdetails.subject})
              </h2>
              <h2 className="question-total-marks">
                Total Marks: &nbsp;{totalMarks}/{paperdetails.marks}
              </h2>
            </div>
            {totalMarks > paperdetails.marks && (
              <div className="error_message_questionDashboard">
                <p>
                  The total marks ({totalMarks}) exceed the allowed marks (
                  {paperdetails.marks}). Please remove <strong>{totalMarks - paperdetails.marks}</strong>{" "}
                  marks to submit the paper.
                </p>
              </div>
            )}
            <div className="question-table">
              {questions.map((question, index) => (
                <div className="questions-table" key={index}>
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
                        {question.questionDescription}
                      </div>
                    </div>
                    <button onClick={()=>duplicateQuestion(question)} style={{width:"200px"}}>Duplicate</button>
                    <button onClick={()=>deleteQuestion(question)} style={{width:"200px"}}>Delete</button>
                    {question.image ? (
                      <div className="question-image">
                        <img src={question.image} alt="question" />
                      </div>
                    ) : (
                      <div className="question-image">
                        <img src={defaultImage} alt="question" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <center>
                {totalMarks < paperdetails.marks && (
                  <button
                    className="add-question-button2"
                    onClick={() =>
                      navigate(`/add-question/${paperId}`, {
                        state: { remainingMarks: paperdetails.marks - totalMarks },
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
                    style={{ backgroundColor: "green", color: "white" }}
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
                      state: { remainingMarks: paperdetails.marks - totalMarks },
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
      < AlertModal
        isOpen={modalIsOpen} 
        onClose={() => setModalIsOpen(false)} 
        message={modalMessage} 
        iserror={isError} 
      />
    </>
  );
};

export default QuestionPaperDashboard;
