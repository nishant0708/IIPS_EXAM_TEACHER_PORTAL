import React, { useState, useEffect } from "react";
import "./QuestionPaperDashboard.css";
import Navbar from "../Navbar/Navbar";
import { FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import defaultImage from "../Assets/no-image-420x370-1.jpg";
import Nothing from "../Assets/nothing.svg";

const QuestionPaperDashboard = () => {
    const navigate = useNavigate();
    const { paperId } = useParams(); // Assuming paperId is passed via URL params
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.post('http://localhost:5000/paper/questionsbyid', { paperId });
                setQuestions(res.data);
            } catch (error) {
                console.error('Failed to fetch questions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [paperId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="question-list-container">
                {questions.length > 0 ? (
                    <>
                        <div className="question-header">
                            <h2 className="question-subject">
                                Mtech(IT) 7<sup>th</sup> Sem (Computer Architecture)
                            </h2>
                            <h2 className="question-total-marks">
                                Total Marks: &nbsp;
                                {questions.reduce((sum, question) => sum + question.marks, 0)}/300
                            </h2>
                        </div>
                        <div className="question-table">
                            {questions.map((question, index) => (
                                <div className="questions-table" key={index}>
                                    <div className="question-table-data">
                                        <div className="compiler">Compiler: {question.compilerReq}</div>
                                        <div className="marks">Marks: {question.marks}</div>
                                        <div className="heading-description">
                                            <h3>{question.questionheading}</h3>
                                            <div className="description">{question.questionDescription
                                            }</div>
                                        </div>
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
                                <button className="add-question-button2" onClick={() => navigate(`/add-question/${paperId}`)}>
                                    <FaPlus />
                                    <p>Add Question</p>
                                </button>
                            </center>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="no-questions-container">
                            <center>
                                <img alt="Nothing" src={Nothing} className="nothing" />
                                <h2>No Questions Found</h2>
                                <button className="add-question-button" onClick={() => navigate(`/add-question/${paperId}`)}>
                                    <FaPlus />
                                    <p>Create Your First Question</p>
                                </button>
                            </center>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default QuestionPaperDashboard;
