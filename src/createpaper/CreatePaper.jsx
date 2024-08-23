import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import './CreatePaper.css';

const CreatePaper = () => {
  return (
    <div className="create_paper_container">
      <div className="formContainer">
        <form>
          <div className="row">
            <div className="inputGroup">
              <label className="label">Class:</label>
              <input type="text" className="class_input" placeholder="Enter class" />
            </div>
            <div className="inputGroup">
              <label className="label">Semester:</label>
              <input type="text" className="semester_input" placeholder="Enter semester" />
            </div>
          </div>
          <div className="inputGroup">
            <label className="label">Subject:</label>
            <input type="text" className="enter_subject" placeholder="Enter subject" />
          </div>
          <div className="row">
            <div className="inputGroup">
              <label className="label">Marks:</label>
              <input type="number" className="enter_marks" placeholder="Enter marks" />
            </div>
            <div className="inputGroup">
              <label className="label">Duration:</label>
              <input type="text" className="enter_duration" placeholder="Enter duration" />
            </div>
          </div>
          <div className="row">
            <div className="inputGroup">
              <label className="label">Subject Code:</label>
              <input type="text" className="enter_subject_code" placeholder="Enter subject code" />
            </div>
            <div className="inputGroup">
              <label className="label">Time of Examination:</label>
              <div className="inputWrapper">
                <input className="enter_time" placeholder="Enter time" />
                <FontAwesomeIcon icon={faClock} className="icon" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="inputGroup">
              <label className="label">Date of Examination:</label>
              <div className="inputWrapper">
                <input className="enter_date" placeholder="Enter date" />
                <FontAwesomeIcon icon={faCalendarAlt} className="icon" />
              </div>
            </div>
          </div>
          <div className="submitButtonContainer">
            <button type="submit" className="submitButton">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePaper;
