import React from "react";
import "./QuestionPaperDashboard.css";
import Navbar from "../Navbar/Navbar";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import image1 from "../Assets/icons8-menu.svg";
import image2 from "../Assets/iips_logo2.png";
import defaultImage from "../Assets/no-image-420x370-1.jpg";
import Nothing from "../Assets/nothing.svg";
const QuestionPaperDashboard=()=>
{
    const navigate=useNavigate();
    const [questions]=
    useState(
        [
            {
                compiler: "C++",
                marks: 100,
                heading: "For Loop",
                description: `
                Write a program using a For Loop aaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                aaaaaaaaaa
                `,
                image : image1,
            },
            {
                compiler: "javascript",
                marks: 70,
                heading: "While Loop",
                description: `Write a program using a While Loop`,
                image : image2,
            },
            {
                compiler: "javascript",
                marks: 70,
                heading: "While Loop",
                description: `Write a program using a While Loop`,
            }
        ]
    );
    return(
        <>
        <Navbar />
        <div className="question-list-container">
            {questions.length > 0 ?
            (
                <>
                <div className="question-header">
                    <h2 className="question-subject">Mtech(IT) 7<sup>th</sup> Sem (Computer Architecture)</h2>
                    <h2 className="question-total-marks">
                        Total Marks: &nbsp;
                        {
                            questions.reduce((sum,question) => (sum + question.marks),0)
                        }/300
                    </h2>
                </div>
                <div className="question-table">
                    {questions.map((question, index) => (
                        <div className="questions-table" key={index}>
                            <div className="question-table-data">
                                <div className="compiler">Compiler: {question.compiler}</div>
                                <div className="marks">Marks : {question.marks}</div>
                                <div className="heading-description">
                                    <h3>{question.heading}</h3>
                                    <div className="description">{question.description}</div>
                                </div>
                                {
                                    question.image ? 
                                    (   
                                        <>
                                        <div className="question-image">
                                            <img src={question.image} alt="question image"/>
                                        </div>
                                        </>
                                    ) : 
                                    (
                                    <>
                                        <div className="question-image">
                                            <img src={defaultImage} alt="question image"/>
                                        </div>
                                    </>
                                    )
                                }
                            </div>
                        </div>
                    ))}
                    <center>
                        <button className="add-question-button2" onClick={()=> navigate("/add-question")}>
                            <FaPlus />
                            <p>Add Question</p>
                        </button>
                    </center>
                </div>
                </>
            )
            : 
            (
                <>
                    <div className="no-questions-container">
                        <center>
                        <img alt="Nothing" src={Nothing} className="nothing"/>
                        <h2>No Questions Found</h2>
                        <button className="add-question-button" onClick={()=> navigate("/add-question")}>
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
}

export default QuestionPaperDashboard;