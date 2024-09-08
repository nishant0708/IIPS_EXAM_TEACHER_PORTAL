import React, { useState } from 'react';
import './question.css';
import { FaTimes } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import { IoCloudUploadOutline } from "react-icons/io5";
import Navbar from '../Navbar/Navbar';


return (
    <>
      <Navbar />

      <div className='add_question_container_main'>
        <div className="add_question_container">
          <h2 className="add_question_heading">Add Question</h2>

          <div>
            <label className="add_question_label">Question Heading:</label>
            <input
              type="text"
              value={questionheading}
              onChange={(e) => setQuestionHeading(e.target.value)}
              placeholder="Enter your question heading"
              required
              className="add_question_input"
            />
          </div>

          <div>
            <label className="add_question_label">Question Description:</label>
            <textarea
              value={questionDescription}
              onChange={(e) => setQuestionDescription(e.target.value)}
              placeholder="Enter question description"
              required
              rows="3"
              className="add_question_textarea"
            />
          </div>

          <div className="add_question_row">
            <div className="add_question_column">
              <label className="add_question_label">Compiler Requirement:</label>
              <select
                value={compilerReq}
                onChange={(e) => setCompilerReq(e.target.value)}
                required
                className="add_question_select"
              >
                <option value="" disabled>Select Compiler</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="sql">SQL</option>
              </select>
            </div>
            <div className="add_question_column">
              <label className="add_question_label">Marks:</label>
              <input
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="Enter marks"
                required
                className="add_question_input"
              />
            </div>
          </div>

          <div>
            <label className="add_question_label">Upload Image (optional):</label>
            <div {...getRootProps({ className: 'add_question_dropbox' })}>
              <input {...getInputProps()} />
              {image ? (
                <div className="add_question_image_preview">
                  <img src={URL.createObjectURL(image)} alt="Question" className="add_question_preview_image" />
                  <FaTimes className="add_question_remove_image_icon" onClick={handleRemoveImage} />
                </div>
              ) : (
                <p>
                  <div className='add_question_cloudicon'>
                    <IoCloudUploadOutline />
                  </div>
                  Drag and drop an image here, or click to select one
                </p>
              )}
            </div>
          </div>

          <button onClick={handleAddQuestion} className="add_question_button" disabled={loading}>
            {loading ? 'Adding...' : 'Add Question'}
          </button>
        </div>
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


export default Question;